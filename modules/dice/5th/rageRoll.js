"use strict";
const { trimString } = require("../../misc");
const getCharacter = require("../getCharacter");
const Roll = require("../Roll");
const { EmbedBuilder } = require("discord.js");
const API = require("../../../realmAPI");

/**
 *
 * @param {Interaction} interaction
 * @returns {DiscordResponse} Response to send to the discord API
 */
module.exports = async function rageRoll(interaction) {
  interaction.args = await getArgs(interaction);
  interaction.rollResults = roll(interaction.args.reroll);
  return { embeds: [getEmbed(interaction)] };
};

async function getArgs(interaction) {
  const args = {
    character: interaction.options.getString("character"),
    reroll: interaction.options.getBoolean("reroll"),
    notes: interaction.options.getString("notes"),
  };
  return args;
}

function roll(reroll) {
  const rollResults = {
    dice: [Roll.single(10)],
    toString: "```ansi\n[2;36m[2;34m[2;36mRage Decreased[0m[2;34m[0m[2;36m[0m\n```",
    passed: false,
    color: "#1981bd",
  };
  if (reroll) rollResults.dice.push(Roll.single(10));

  for (const dice of rollResults.dice) {
    if (dice >= 6) {
      rollResults.passed = true;
      rollResults.toString = "```Rage Unchanged```";
      rollResults.color = "#1c1616";
    }
  }
  return rollResults;
}

function getEmbed(interaction) {
  const results = interaction.rollResults;
  const embed = new EmbedBuilder();
  embed.setAuthor({
    name:
      interaction.member?.displayName ??
      interaction.user.displayName ??
      interaction.user.username,
    iconURL:
      interaction.member?.displayAvatarURL() ??
      interaction.user.displayAvatarURL(),
  });

  embed.setTitle("Rage Check");
  embed.setColor(results.color);
  embed.setURL("https://realmofdarkness.app/");

  /*
  if (!results.passed)
    embed.setThumbnail('https://cdn.discordapp.com/attachments/7140' +
    '50986947117076/886855116035084288/RealmOfDarknessSkullnoBNG.png');
  */

  if (interaction.args.character) {
    const char = interaction.args.character;
    embed.addFields({ name: "Character", value: char });
    if (char.tracked?.thumbnail) embed.setThumbnail(char.tracked.thumbnail);
  }

  embed.addFields({ name: "Rage Dice", value: `${results.dice.join(" ")}` });
  if (interaction.args.notes)
    embed.addFields({ name: "Notes", value: interaction.args.notes });
  embed.addFields({ name: "Result", value: results.toString });

  const links =
    "\n[Website](https://realmofdarkness.app/)" +
    " | [Commands](https://v5.realmofdarkness.app/)" +
    " | [Patreon](https://www.patreon.com/MiraiMiki)";

  embed.data.fields.at(-1).value += links;
  return embed;
}
