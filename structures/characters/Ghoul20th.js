'use strict';
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats, Emoji } = require('../../Constants');

module.exports = class Ghoul20th extends Character20th
{
  constructor({name, user, guild, humanity=7, vitae=1, willpower=6}={}) 
  {
    super({name:name, user:user, guild:guild, willpower:willpower});
    this.splat = Splats.ghoul20th;
    this.morality = {
      name: 'Humanity', 
      pool: new Consumable(10, humanity, 0),
    };
    this.blood = new Consumable(10, 10, 0);
    this.vitae = new Consumable(5, vitae, 0);
  }

  static getSplat()
  {
    return Splats.ghoul20th;
  }

  setFields(args)
  {
    super.setFields(args);
    if (args.blood != null) this.blood.setCurrent(args.blood);
    if (args.morality != null) this.morality.pool.setCurrent(args.morality);
    if (args.vitae != null) this.vitae.setCurrent(args.vitae);
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.blood != null) this.blood.updateCurrent(args.blood);
    if (args.morality != null) this.morality.pool.updateCurrent(args.morality);
    if (args.vitae != null) this.vitae.updateCurrent(args.vitae);
  }

  deserilize(char)
  {
    super.deserilize(char);
    this.morality.pool.setCurrent(char.morality);
    this.blood.setCurrent(char.blood);
    this.vitae.setCurrent(char.vitae);
    return this;
  }

  serialize()
  {        
    const s = super.serialize();      
    s.character['splat'] = this.splat.slug;        
    s.character['morality'] = this.morality.pool.current;
    s.character['blood'] = this.blood.current;
    s.character['vitae'] = this.vitae.current;      
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
      name: `Vitae [${this.vitae.current}/5]`, 
      value: this.vitae.getTracker({emoji: Emoji.red_dot}), 
      inline: false
    });

    embed.addFields({
      name: `Blood [${this.blood.current}/10]`,
      value: this.blood.getTracker({emoji: Emoji.red_dot}),
      inline: false
    });
    
    embed.addFields({
      name: `Humanity ${this.morality.pool.current}`, 
      value: this.morality.pool.getTracker({emoji: Emoji.purple_dot_3}), 
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
    embed.fields.at(-1).value += links;

    return embed;
  }
}