"use strict";
require(`${process.cwd()}/alias`);
const { trimString } = require("@modules/misc");
const HunterV5RollResults = require("@structures/hunterV5RollResults");
const handleRerollPress = require("@modules/dice/5th/handleButtonPress");
const {
  getComponents,
  getEmbed,
  getContent,
} = require("@modules/dice/5th/getHunterRollResponse");
const getCharacter = require("@modules/dice/getCharacter");
const API = require("@api");

module.exports = async function HunterDice(interaction) {
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction.arguments);

  await handleRerollPress(interaction, getEmbed, getComponents, getContent);
  return {
    content: getContent(interaction),
    embeds: [getEmbed(interaction)],
    components: getComponents(interaction),
  };
};

async function getArgs(interaction) {
  const args = {
    pool: interaction.options.getInteger("pool"),
    desperation: interaction.options.getInteger("desperation") ?? null,
    difficulty: interaction.options.getInteger("difficulty") ?? 0,
    spec: interaction.options.getString("speciality") ?? null,
    notes: interaction.options.getString("notes") ?? null,
    character: await getCharacter(
      trimString(interaction.options.getString("character")),
      interaction
    ),
  };

  if (!args.character && interaction.guild) {
    const defaults = await API.characterDefaults.get(
      interaction.guild.id,
      interaction.user.id
    );

    if (defaults)
      args.character = await getCharacter(defaults.name, interaction);
  }

  return args;
}

async function roll(args) {
  const results = new HunterV5RollResults({
    difficulty: args.difficulty,
    pool: args.pool,
    desperation: args.desperation,
    spec: args.spec,
  });

  results.rollDice();
  return results;
}
