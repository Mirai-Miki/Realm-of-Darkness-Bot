"use strict";
const { getEmbed, getContent, getComponents } = require("./getWtaRollResponse");
const { trimString } = require("../../misc");
const getCharacter = require("../getCharacter");
const Wta5thRollResults = require("../../../structures/Wta5thRollResults");
const handleButtonPress = require("./handleButtonPress");
const API = require("../../../realmAPI");

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async function riteRoll(interaction) {
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction);

  await handleButtonPress(interaction, getEmbed, getComponents, getContent);
  return {
    content: getContent(interaction),
    embeds: [getEmbed(interaction)],
    components: getComponents(interaction),
  };
};

async function getArgs(interaction) {
  const args = {
    pool: interaction.options.getInteger("pool"),
    rage: interaction.options.getInteger("rage"),
    trainedParticipants: interaction.options.getInteger("trained_participants"),
    participants: interaction.options.getInteger("participants"),
    difficulty: interaction.options.getInteger("difficulty"),
    spec: interaction.options.getString("speciality"),
    rageCheck: interaction.options.getString("rage_check"),
    notes: interaction.options.getString("notes"),
    character: await getCharacter(
      trimString(interaction.options.getString("character")),
      interaction
    ),
  };

  if (interaction.guild && !args.character) {
    const defaults = await API.characterDefaults.get(
      interaction.guild.id,
      interaction.user.id
    );

    if (defaults && !args.character)
      args.character = await getCharacter(defaults.name, interaction);
  }

  return args;
}

/**
 * Takes a set of arguments and performs a roll
 * @param {Object} args Arguments recieved from the interaction
 */
async function roll(interaction) {
  const args = interaction.arguments;
  if (
    args.character?.tracked &&
    args.character.tracked.splat.slug === "werewolf5th"
  ) {
    args.rage = args.character.tracked.rage.current;
  }

  const pool =
    (args.pool ?? 0) +
    (args.participants ?? 0) +
    (args.trainedParticipants ?? 0) * 2;
  const results = new Wta5thRollResults({
    difficulty: args.difficulty ?? 1,
    pool: pool,
    spec: args.spec,
  });

  const rage =
    (args.rage ?? 0) +
    (args.participants ?? 0) +
    (args.trainedParticipants ?? 0);
  results.rollDice(rage);
  results.setOutcome();

  if (args.rageCheck != null) results.setRageCheck(args.rageCheck);
  return results;
}
