'use strict';
const Consumable = require("../structures/Consumable");
const Character5th = require("./base/Character5th");
const Humanity = require("../structures/humanity5th.js");
const { Splats } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Vampire5th extends Character5th
{
  constructor({name, health=4, willpower=2, humanity=7, user, guild}={}) 
  {
    super({
      name: name,
      health: health, 
      willpower: willpower,
      user: user,
      guild: guild
    });
      
    this.splat = Splats.vampire5th;
    this.hunger = new Consumable(5, 1, 0);              
    this.humanity = new Humanity(humanity);
  }

  static getSplat()
  {
      return Splats.vampire5th;
  }

  deserilize(json)
  {
    super.deserilize(json);
    this.hunger.setCurrent(json.hunger);
    this.humanity = new Humanity(json.humanity.total);
    this.humanity.takeStains(json.humanity.stains);
  }

  serialize()
  {        
    const s = super.serialize();
    
    s.character['splat'] = Splats.vampire5th;        
    s.character['hunger'] = this.hunger.current;
    s.character['humanity'] = {
      total: this.humanity.total,
      stains: this.humanity.stains,
    }
    
    return s;
  }

  getEmbed()
  {
    let hungerOverflow = '';
    // Adding Hunger messages if character has hunger
    if (char.hunger.overflow > 0) {
      hungerOverflow = `${char.hunger.overflow} hunger has ` +
          "overflowed. You should now do a hunger frenzy check. p220"
    }
    else if (char.hunger.current == 5) {
      hungerOverflow = `Hunger is currently 5` +
          ". You can no longer intentionally rouse the blood. p211"
    }

    const embed = new EmbedBuilder();
    embed.setColor(char.colour)
    .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png')
    .setTitle(char.name)
    .setAuthor({
      name: (char.user.displayName ?? char.user.username), 
      iconURL: char.user.avatarURL
    })
    
    embed.addFields({
      name: "Willpower", 
      value: char.willpower.getTracker() + char.willpower.getHealthStatus('willpower'),
      inline: false
    })
    embed.addFields({
      name: "Health", 
      value: char.health.getTracker() + char.health.getHealthStatus('health'),
      inline: false
    });
    
    if (char.thumbnail) embed.setThumbnail(char.thumbnail);      
    
    embed.addFields({
      name: "Humanity", 
      value: char.humanity.getTracker() + char.humanity.getDegenerationInfo(),
      inline: false
    })
    
    embed.addFields({
      name: "Hunger", 
      value: char.hunger.getTracker() + hungerOverflow, 
      inline: false
    });

    if (char.exp.total) embed.addFields({
      name: "Experience", 
      value: char.exp.getTracker({showEmoji: false}), 
      inline: false
    });

    if (args?.notes) embed.addFields({name: "Notes", value: args.notes});

    const links = "\n[Website](https://realmofdarkness.app/)" +
      " | [Commands](https://realmofdarkness.app/v5/commands/)" +
      " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.data.fields.at(-1).value += links;
    return embed;
  }
}