'use strict';
const { trimString } = require('../../misc');
const getCharacter = require('./getCharacter');
const { getEmbed, getContent, getComponents } = require('./getVtmRollResponse');
const { VtMV5RollResults } = require('../../../structures');
const handleRerollPress = require('./handleRerollPress');


/**
 * 
 * @param {Interaction} interaction 
 */
module.exports.vtmRoll = async function(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction.arguments);
  
  handleRerollPress(interaction, getEmbed, getComponents);
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
    hunger: interaction.options.getInteger('hunger'),
    difficulty: interaction.options.getInteger('difficulty'),
    bp: interaction.options.getInteger('blood_surge'),
    spec: interaction.options.getString('speciality'),
    rouse: interaction.options.getString('rouse'),
    notes: interaction.options.getString('notes'),
    character: await getCharacter(
      trimString(interaction.options.getString('character')),
      interaction
    ),
    autoHunger: interaction.options.getBoolean('auto_hunger'),
  }
}

/**
 * Takes a set of arguments and performs a roll
 * @param {Object} args Arguments recieved from the interaction
 */
async function roll(args)
{
  if (args.character?.tracked && args.autoHunger && 
    args.character.tracked.slug === 'vampire5th')
  {
    args.hunger = args.character.tracked.hunger;
  }

  const results = new VtMV5RollResults({
    difficulty: args.difficulty ?? 1,
    pool: args.pool,
    bp: args.bp,
    spec: args.spec,
    hunger: args.hunger ?? 0
  });
  results.rollDice(args.hunger);
  results.setOutcome();
  
  if (args.bp != null) results.setBloodSurge(args.bp);
  if (args.rouse != null) results.setRouse(args.rouse);
  return results;
}