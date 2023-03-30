'use strict';
const Consumable = require("../Consumable");
const Character5th = require("./base/Character5th");
const Humanity = require("../humanity5th");
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

  setFields(args)
  {
    super.setFields(args);
    if (args.hunger != null) this.hunger.setCurrent(args.hunger);
    if (args.humanity != null) this.humanity.setCurrent(args.humanity);
    if (args.stains != null) this.humanity.setStains(args.stains);
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.hunger != null) this.hunger.updateCurrent(args.hunger);
    if (args.humanity != null) this.humanity.updateCurrent(args.humanity);
    if (args.stains != null) this.humanity.takeStains(args.stains);
  }

  deserilize(json)
  {
    super.deserilize(json);
    this.hunger.setCurrent(json.hunger);
    this.humanity = new Humanity(json.humanity.total);
    this.humanity.takeStains(json.humanity.stains);
    return this;
  }

  serialize()
  {        
    const s = super.serialize();    
    s.character['splatSlug'] = this.splat.slug;        
    s.character['hunger'] = this.hunger.current;
    s.character['humanity'] = {
      total: this.humanity.total,
      stains: this.humanity.stains,
    }    
    return s;
  }

  getEmbed(notes)
  {
    let hungerOverflow = '';
    // Adding Hunger messages if character has hunger
    if (this.hunger.overflow > 0) {
      hungerOverflow = `${this.hunger.overflow} hunger has ` +
          "overflowed. You should now do a hunger frenzy check. p220"
    }
    else if (this.hunger.current == 5) {
      hungerOverflow = `Hunger is currently 5` +
          ". You can no longer intentionally rouse the blood. p211"
    }

    const embed = new EmbedBuilder();
    embed.setColor(this.color)
    .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png')
    .setTitle(this.name)
    .setAuthor({
      name: (this.user.displayName), 
      iconURL: this.user.avatarURL
    })
    
    embed.addFields({
      name: "Willpower", 
      value: this.willpower.getTracker() + this.willpower.getHealthStatus('willpower'),
      inline: false
    })
    embed.addFields({
      name: "Health", 
      value: this.health.getTracker() + this.health.getHealthStatus('health'),
      inline: false
    });
    
    if (this.thumbnail) embed.setThumbnail(this.thumbnail);      
    
    embed.addFields({
      name: "Humanity", 
      value: this.humanity.getTracker() + this.humanity.getDegenerationInfo(),
      inline: false
    })
    
    embed.addFields({
      name: "Hunger", 
      value: this.hunger.getTracker() + hungerOverflow, 
      inline: false
    });

    if (this.exp.total) embed.addFields({
      name: "Experience", 
      value: this.exp.getTracker({showEmoji: false}), 
      inline: false
    });
    
    if (notes) embed.addFields({name: "Notes", value: notes});

    const links = "\n[Website](https://realmofdarkness.app/)" +
      " | [Commands](https://realmofdarkness.app/v5/commands/)" +
      " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.data.fields.at(-1).value += links;
    return embed;
  }
}