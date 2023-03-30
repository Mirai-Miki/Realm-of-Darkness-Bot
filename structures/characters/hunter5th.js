'use strict';
const Consumable = require("../Consumable");
const Character5th = require("./base/Character5th");
const { Splats, Emoji } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Hunter5th extends Character5th
{
  constructor(interaction, health=4, willpower=2) 
  {
    super(interaction, health, willpower);    
    this.splat = Splats.hunter5th;
    // Desperation is shared stat between coterie
    this.desperation = new Consumable(5, 1, 1);
    // Danger is a shared stat between coterie   
    this.danger = new Consumable(5, 1, 1);
    // Despair is a boolean state triggered by rolling with desperation
    this.despair = false;
  }

  static getSplat()
  {
      return Splats.hunter5th;
  }  

  setFields(args)
  {
    super.setFields(args);
    if (args.desperation != null) this.desperation.setCurrent(args.desperation);
    if (args.danger != null) this.danger.setCurrent(args.danger);
    if (args.despair != null) this.despair = args.despair;
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.desperation != null) this.desperation.updateCurrent(args.desperation);
    if (args.danger != null) this.danger.updateCurrent(args.danger);
    if (args.despair != null) this.despair = args.despair;
  }  

  deserilize(char)
  {
    super.deserilize(char);
    this.desperation.setCurrent(char.desperation);
    this.danger.setCurrent(char.danger);
    this.despair = char.despair;
    return this;
  }

  serialize()
  {        
    const s = super.serialize();      
    s.character['splatSlug'] = this.splat.slug;
    s.character['desperation'] = this.desperation.current;
    s.character['danger'] = this.danger.current;
    s.character['despair'] = this.despair;      
    return s;
  }

  getEmbed(notes)
  {
    const embed = new EmbedBuilder();
    embed.setColor(this.color)
    .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png')
    .setTitle(this.name)
    .setAuthor({
      name: (this.user.displayName ?? this.user.username), 
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
        name: "Desperation",
        value: this.desperation.getTracker({emoji: Emoji.purple_dot_3}),
        inline: false
    });

    embed.addFields({
        name: "Danger",
        value: this.danger.getTracker({emoji: Emoji.red_dot}),
        inline: false
    });

    if (this.despair)
      embed.addFields({
          name: "Despair",
          value: Emoji.hunter_pass,
          inline: false
      })

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