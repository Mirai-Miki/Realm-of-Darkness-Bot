'use strict'
const { trimString } = require('../../misc');
const HunterV5RollResults = require('../../../structures/hunterV5RollResults');
const handleRerollPress = require('./handleRerollPress');
const { getComponents, getEmbed, getContent } = require('./getHunterRollResponse');
const getCharacter = require('../getCharacter');


module.exports = async function HunterDice(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction.arguments);
  
  handleRerollPress(interaction, getEmbed, getComponents, getContent);
  return {
    content: getContent(interaction),
    embeds: [getEmbed(interaction)],
    components: getComponents(interaction)
  };
}

async function getArgs(interaction)
{
  return {
    pool: interaction.options.getInteger('pool'),
    desperation: interaction.options.getInteger('desperation') ?? null,
    difficulty: interaction.options.getInteger('difficulty') ?? 0,
    spec: interaction.options.getString('speciality') ?? null,
    notes: interaction.options.getString('notes') ?? null,
    character: await getCharacter(
      trimString(interaction.options.getString('character')),
      interaction
    ),
  }
}

async function roll(args)
{
  const results = new HunterV5RollResults({
    difficulty: args.difficulty,
    pool: args.pool,
    desperation: args.desperation,
    spec: args.spec
  });

  results.rollDice();
  return results;
}