'use strict';
const slugifiy = require('../../modules/misc').slugifiy;
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats, Emoji } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Vampire20th extends Character20th
{
  constructor({name, user, guild, humanity=7, blood=10, willpower=6}={}) 
  {
    super({name:name, user:user, guild:guild, willpower:willpower});
    this.splat = Splats.vampire20th;
    this.morality = {
      name: 'Humanity', 
      pool: new Consumable(10, humanity, 0),
    };
    this.blood = new Consumable(blood, blood, 0);
  }

  static getSplat()
  {
      return Splats.vampire20th;
  }

  setFields(args)
  {
    super.setFields(args);    
    if (args.blood != null) this.blood.setTotal(args.blood);
    if (args.morality != null) this.morality.pool.setCurrent(args.morality);
    if (args.moralityName != null) this.morality.name = args.moralityName;
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.blood != null) this.blood.updateCurrent(args.blood);
    if (args.morality != null) this.morality.pool.updateCurrent(args.morality);
  }

  deserilize(json)
  {
    super.deserilize(json);
    this.morality.pool.setCurrent(json.morality.current);
    this.morality.name = json.morality.name;
    this.blood.setTotal(json.blood.total);
    this.blood.setCurrent(json.blood.current);
    return this;
  }

  serialize()
  {        
    const s = super.serialize();    
    s.character['splatSlug'] = this.splat.slug;        
    s.character['morality'] = {
        name: slugifiy(this.morality.name),
        current: this.morality.pool.current,
    };
    s.character['blood'] = {
        total: this.blood.total,
        current: this.blood.current,
    };    
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

    if (this.blood.total > 15)
    {
      embed.addFields({
        name: 'Blood', 
        value: this.blood.getTracker({showEmoji:false}), 
        inline: false
      });
    }
    else
    {
      embed.addFields({
        name: `Blood [${this.blood.current}/${this.blood.total}]`, 
        value: this.blood.getTracker({emoji: Emoji.red_dot}), 
        inline: false
      });
    }

    embed.addFields({
      name: `${this.morality.name} ${this.morality.pool.current}`, 
      value: this.morality.pool.getTracker({emoji: Emoji.purple_dot_2}), 
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