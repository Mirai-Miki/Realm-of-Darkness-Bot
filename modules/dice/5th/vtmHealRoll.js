"use strict";
const { trimString } = require("../../misc");
const getCharacter = require("../getCharacter");
const Roll = require("../Roll");
const { EmbedBuilder } = require("discord.js");
const API = require("../../../realmAPI");
const { RealmError, ErrorCodes } = require("../../../Errors");

module.exports = {
  healSuperficial,
  healAgg,
};

/**
 * Heals superficial damage for a Vampire character.
 * @param {Interaction} interaction - The interaction object from Discord.
 * @returns {Promise<Object>} - The response to send to Discord.
 */
async function healSuperficial(interaction) {
  const args = await getArgs(interaction);
  const character = args.character;

  if (!character || character.splat !== "vampire5th") {
    throw new RealmError({ code: ErrorCodes.IncorrectCharType });
  }

  const type = interaction.options.getString("type");
  let rouseResult = null;

  if (type === "health") {
    const bp = character.bloodPotency;
    const healAmount = getHealthHealAmount(bp);
    rouseResult = rollRouse();
    if (!rouseResult.passed) {
      character.hunger.updateCurrent(1);
    }
    character.health.healSuperficial(healAmount);
  } else if (type === "willpower") {
    const healAmount = Math.max(
      character.attributes.composure,
      character.attributes.resolve
    );
    character.willpower.healSuperficial(healAmount);
  }

  await character.save(interaction.client);
  return { embeds: [getEmbed(character, rouseResult, type)] };
}

/**
 * Heals aggravated damage for a Vampire character.
 * @param {Interaction} interaction - The interaction object from Discord.
 * @returns {Promise<Object>} - The response to send to Discord.
 */
async function healAgg(interaction) {
  const args = await getArgs(interaction);
  const character = args.character;

  if (!character || character.splat !== "vampire5th") {
    throw new RealmError({ code: ErrorCodes.IncorrectCharType });
  }

  const rouseResults = [rollRouse(), rollRouse(), rollRouse()];
  for (const result of rouseResults) {
    if (!result.passed) {
      character.hunger.updateCurrent(1);
    }
  }
  character.health.healAgg(1);

  await character.save(interaction.client);
  return { embeds: [getEmbed(character, rouseResults, "agg")] };
}

/**
 * Retrieves the arguments for the interaction.
 * @param {Interaction} interaction - The interaction object from Discord.
 * @returns {Promise<Object>} - The arguments for the interaction.
 */
async function getArgs(interaction) {
  const args = {
    name: trimString(interaction.options.getString("name")),
    notes: interaction.options.getString("notes"),
  };

  if (!args.name) {
    if (!interaction.guild) {
      throw new RealmError({ code: ErrorCodes.NoCharacterSelected });
    }

    const defaults = await API.characterDefaults.get(
      interaction.guild.id,
      interaction.user.id
    );
    args.name = defaults ? defaults.name : null;
  }

  args.character = await API.getCharacterDefault({
    client: interaction.client,
    name: args.name ?? null,
    user: interaction.user,
    guild: interaction.guild ?? null,
  });

  if (
    args.character.splat !== Splats.vampire5th &&
    args.character.splat !== Splats.mortal5th
  )
    throw new RealmError({ code: ErrorCodes.IncorrectCharType });

  return args;
}

/**
 * Rolls a single rouse check.
 * @returns {Object} - The result of the rouse check.
 */
function rollRouse() {
  const dice = Roll.single(10);
  return {
    dice,
    passed: dice >= 6,
  };
}

/**
 * Determines the amount of health to heal based on blood potency.
 * @param {number} bp - The blood potency of the character.
 * @returns {number} - The amount of health to heal.
 */
function getHealthHealAmount(bp) {
  if (bp <= 1) return 1;
  if (bp <= 3) return 2;
  if (bp <= 7) return 3;
  if (bp <= 9) return 4;
  return 5;
}

/**
 * Creates an embed for the healing roll result.
 * @param {Object} character - The character object.
 * @param {Object|Array} rouseResults - The result(s) of the rouse check(s).
 * @param {string} type - The type of healing.
 * @returns {EmbedBuilder} - The embed object.
 */
function getEmbed(character, rouseResults, type) {
  const embed = new EmbedBuilder()
    .setTitle("Healing Roll")
    .setColor("#8c0f28")
    .setURL("https://realmofdarkness.app/")
    .setAuthor({
      name: character.name,
      iconURL: character.thumbnail,
    });

  if (type === "agg") {
    embed.addFields({
      name: "Rouse Checks",
      value: rouseResults.map((r) => r.dice).join(", "),
    });
  } else if (rouseResults) {
    embed.addFields({
      name: "Rouse Check",
      value: rouseResults.dice,
    });
  }

  embed.addFields({
    name: "Healing Type",
    value: type,
  });

  const links =
    "\n[Website](https://realmofdarkness.app/)" +
    " | [Commands](https://v5.realmofdarkness.app/)" +
    " | [Patreon](https://www.patreon.com/MiraiMiki)";
  embed.addFields({ name: "⠀", value: links });

  return embed;
}
