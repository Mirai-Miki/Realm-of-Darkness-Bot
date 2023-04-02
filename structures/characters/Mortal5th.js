'use strict';
const Character5th = require("./base/Character5th");
const Humanity = require("../humanity5th.js");
const { Splats } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Mortal5th extends Character5th
{
  constructor(interaction, health=4, willpower=2, humanity=7) 
  {
    super(interaction, health, willpower);      
    this.splat = Splats.mortal5th;             
    this.humanity = new Humanity(humanity);
  }

  static getSplat()
  {
    return Splats.mortal5th;
  }

  setFields(args)
  {
    super.setFields(args);
    if (args.humanity != null) this.humanity.setCurrent(args.humanity);
    if (args.stains != null) this.humanity.setStains(args.stains);
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.humanity != null) this.humanity.updateCurrent(args.humanity);
    if (args.stains != null) this.humanity.takeStains(args.stains);
  }  

  deserilize(char)
  {
    super.deserilize(char);
    this.humanity = new Humanity(char.humanity.total);
    this.humanity.takeStains(char.humanity.stains);
    return this;
  }

  serialize()
  {        
    const s = super.serialize();    
    s.character['splatSlug'] = this.splat.slug;        
    s.character['humanity'] = {
        total: this.humanity.total,
        stains: this.humanity.stains,
    }    
    return s;
  }

  getEmbed(notes)
  {
    const embed = new EmbedBuilder();
    embed.setColor(this.color)
    .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png')
    .setTitle(this.name)
    .setAuthor({
      name: this.user.displayName, 
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