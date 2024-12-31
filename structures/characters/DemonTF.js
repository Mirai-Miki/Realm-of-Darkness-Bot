"use strict";
const Consumable = require("../Consumable");
const Counter = require("../Counter");
const Character20th = require("./base/Character20th");
const { Splats, Emoji } = require("../../Constants");
const { EmbedBuilder } = require("discord.js");

module.exports = class DemonTF extends Character20th {
  constructor({ client, name, willpower = 6 } = {}) {
    super({ client, name, willpower });
    this.splat = Splats.demonTF;
    this.faith = new Consumable(10, 6, 1);
    this.torment = new Counter(5, 0);
  }

  static getSplat() {
    return Splats.demonTF;
  }

  setFields(args) {
    super.setFields(args);
    if (args.faith != null) this.faith.setTotal(args.faith);
    if (args.torment != null) this.torment.setPrimary(args.torment);
  }

  updateFields(args) {
    super.updateFields(args);
    if (args.faith != null) this.faith.updateCurrent(args.faith);
    if (args.torment != null) this.torment.updateSecondary(args.torment);
  }

  async deserilize(char) {
    await super.deserilize(char);
    this.faith.setTotal(char.faith_total);
    this.faith.setCurrent(char.faith_current);
    this.torment.setPrimary(char.torment_total);
    this.torment.setSecondary(char.torment_current);
    return this;
  }

  serialize(newSave) {
    const s = super.serialize();
    if (this.class || newSave) s.character["class"] = this.splat.slug;
    else s.character["splatSlug"] = this.splat.slug;
    s.character["faith_total"] = this.faith.total;
    s.character["faith_current"] = this.faith.current;
    s.character["torment_total"] = this.torment.primary;
    s.character["torment_current"] = this.torment.secondary;
    return s;
  }

  getEmbed(notes) {
    const embed = new EmbedBuilder()
      .setColor(this.color)
      .setAuthor(this.getAuthor())
      .setTitle(this.name)
      .setURL("https://realmofdarkness.app/");

    if (this.thumbnail) embed.setThumbnail(this.thumbnail);

    embed.addFields({
      name: `Willpower [${this.willpower.current}/${this.willpower.total}]`,
      value: this.willpower.getTracker({ emoji: Emoji.purple_dot_3 }),
      inline: false,
    });

    embed.addFields({
      name: `Faith [${this.faith.current}/${this.faith.total}]`,
      value: this.faith.getTracker({ emoji: Emoji.red_dot }),
      inline: false,
    });

    embed.addFields({
      name: `Torment - Permanent: ${this.torment.primary}`,
      value: this.torment.getPrimaryTracker({ emoji: Emoji.purple_dot_1 }),
      inline: false,
    });

    embed.addFields({
      name: `Torment - Temporary: ${this.torment.secondary}`,
      value: this.torment.getSecondaryTracker({ emoji: Emoji.purple_dot_2 }),
      inline: false,
    });

    embed.addFields({
      name: "Health",
      value: this.health.getTracker(),
      inline: false,
    });

    if (this.exp.total)
      embed.addFields({
        name: "Experience",
        value: this.exp.getTracker({ showEmoji: false }),
        inline: false,
      });

    if (notes) embed.addFields({ name: "Notes", value: notes });
    const links =
      "\n[Website](https://realmofdarkness.app/) " +
      "| [Commands](https://realmofdarkness.app/20th/commands/) " +
      "| [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.data.fields.at(-1).value += links;

    return embed;
  }
};
