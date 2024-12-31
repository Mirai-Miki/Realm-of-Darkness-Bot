"use strict";
const Character5th = require("./base/Character5th");
const Humanity = require("../humanity5th.js");
const { Splats } = require("../../Constants");
const { EmbedBuilder } = require("discord.js");

module.exports = class Mortal5th extends Character5th {
  constructor({
    client,
    name,
    health = 4,
    willpower = 2,
    humanity = 7,
    splat = "human5th",
  } = {}) {
    super({ client, name, health, willpower });
    this.splat = Splats[splat];
    this.humanity = new Humanity(humanity);
  }

  static getSplat(splat) {
    return Splats[splat];
  }

  setFields(args) {
    super.setFields(args);
    if (args.humanity != null) this.humanity.setCurrent(args.humanity);
    if (args.stains != null) this.humanity.setStains(args.stains);
  }

  updateFields(args) {
    super.updateFields(args);
    if (args.humanity != null) this.humanity.updateCurrent(args.humanity);
    if (args.stains != null) this.humanity.takeStains(args.stains);
  }

  async deserilize(char) {
    await super.deserilize(char);
    this.humanity = new Humanity(char.humanity.total);
    this.humanity.takeStains(char.humanity.stains);
    return this;
  }

  serialize(newSave) {
    const s = super.serialize();
    if (this.class || newSave) s.character["class"] = this.splat.slug;
    else s.character["splatSlug"] = this.splat.slug;
    s.character["humanity"] = this.humanity.total;
    s.character["stains"] = this.humanity.stains;
    return s;
  }

  getEmbed(notes) {
    const embed = new EmbedBuilder();
    embed
      .setColor(this.color)
      .setURL("https://realmofdarkness.app/")
      .setTitle(this.name)
      .setAuthor(this.getAuthor());

    embed.addFields({
      name: "Willpower",
      value:
        this.willpower.getTracker() +
        this.willpower.getHealthStatus("willpower"),
      inline: false,
    });
    embed.addFields({
      name: "Health",
      value: this.health.getTracker() + this.health.getHealthStatus("health"),
      inline: false,
    });

    if (this.thumbnail) embed.setThumbnail(this.thumbnail);

    embed.addFields({
      name: "Humanity",
      value: this.humanity.getTracker() + this.humanity.getDegenerationInfo(),
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
      "\n[Website](https://realmofdarkness.app/)" +
      " | [Commands](https://realmofdarkness.app/v5/commands/)" +
      " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.data.fields.at(-1).value += links;
    return embed;
  }
};
