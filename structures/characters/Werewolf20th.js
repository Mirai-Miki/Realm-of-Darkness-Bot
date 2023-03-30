'use strict';
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats, Emoji } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Werewolf20th extends Character20th 
{
  constructor({name, user, guild, rage=7, gnosis=7, willpower=6}={}) 
  {
    super({name:name, user:user, guild:guild, willpower:willpower});
    this.splat = Splats.werewolf20th;
    this.rage = new Consumable(rage, rage, 0);
    this.gnosis = new Consumable(gnosis, gnosis, 0);
    this.rage.unlock(10);
  }

  static getSplat()
  {
    return Splats.werewolf20th;
  }

  setFields(args)
  {
    super.setFields(args);
    if (args.rage != null) this.rage.setTotal(args.rage);
    if (args.gnosis != null) this.gnosis.setTotal(args.gnosis);
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.rage != null) this.rage.updateCurrent(args.rage);
    if (args.gnosis != null) this.gnosis.updateCurrent(args.gnosis);
  }

  deserilize(char)
  {
    super.deserilize(char);
    this.rage.setTotal(char.rage.total);
    this.rage.setCurrent(char.rage.current);
    this.gnosis.setTotal(char.gnosis.total);
    this.gnosis.setCurrent(char.gnosis.current);
    return this;
  }

  serialize()
  {        
    const s = super.serialize();    
    s.character['splatSlug'] = this.splat.slug;        
    s.character['rage'] = {
        total: this.rage.total,
        current: this.rage.current,
    }
    s.character['gnosis'] = {
        total: this.gnosis.total,
        current: this.gnosis.current,
    }    
    return s;
  }

  getEmbed(notes)
  {
    const embed = new EmbedBuilder()
    .setColor(this.color)
    .setAuthor({
      name: (this.user.displayName ?? this.user.username), 
      iconURL: this.user.avatarURL
    })
    .setTitle(this.name)
    .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');

    if (this.thumbnail) embed.setThumbnail(this.thumbnail);

    embed.addFields({
      name: `Willpower [${this.willpower.current}/${this.willpower.total}]`,
      value: this.willpower.getTracker({emoji: Emoji.purple_dot_3}),
      inline: false
    });

    embed.addFields({
      name: `Rage [${this.rage.current}/${this.rage.total}]`, 
      value: this.rage.getTracker({emoji: Emoji.purple_dot_2}), 
      inline: false
    });

    embed.addFields({
      name: `Gnosis [${this.gnosis.current}/${this.gnosis.total}]`,
      value: this.gnosis.getTracker({emoji: Emoji.purple_dot_1}),
      inline: false
    });

    embed.addFields({
      name: 'Health',
      value: this.health.getTracker(),
      inline: false
    });

    if (this.exp.total) embed.addFields({
      name: 'Experience',
      value: this.exp.getTracker({showEmoji: false}),
      inline: false
    });

    if (notes) embed.addFields({name: 'Notes', value: notes});
    const links = "\n[Website](https://realmofdarkness.app/)" +
        " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.data.fields.at(-1).value += links;

    return embed;
  }
}