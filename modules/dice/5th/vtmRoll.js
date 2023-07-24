'use strict';
const { trimString } = require('../../misc');
const getCharacter = require('../getCharacter');
const { getEmbed, getContent, getComponents } = require('./getVtmRollResponse');
const VtMV5RollResults = require('../../../structures/vtmV5RollResults');
const handleRerollPress = require('./handleButtonPress');
const API = require('../../../realmAPI');


/**
 * 
 * @param {Interaction} interaction 
 */
module.exports = async function vtmRoll(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction);
  
  await handleRerollPress(interaction, getEmbed, getComponents, getContent);
  return {
    content: getContent(interaction),
    embeds: [getEmbed(interaction)],
    components: getComponents(interaction)
  };
}

async function getArgs(interaction)
{
  const args = {
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

  if (interaction.guild && (!args.character || args.autoHunger === null))
  {
    const defaults = await API.characterDefaults.get(
      interaction.guild.id, interaction.user.id
    )
    
    if (defaults && !args.character)
      args.character = await getCharacter(defaults.name, interaction);

    if (!args.character?.tracked?.hunger)
      args.autoHunger = false;
    else if (defaults && args.autoHunger === null)
      args.autoHunger = defaults.autoHunger;
  }

  return args;
}

/**
 * Takes a set of arguments and performs a roll
 * @param {Object} args Arguments recieved from the interaction
 */
async function roll(interaction)
{
  const args = interaction.arguments;
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
  let hunger = args.hunger;
  if (args.character?.tracked && args.autoHunger) 
    hunger = args.character.tracked.hunger.current;
  results.rollDice(hunger);
  results.setOutcome();
  
  if (args.bp != null) results.setBloodSurge(args.bp);
  if (args.rouse != null) results.setRouse(args.rouse);
  await updateHunger(interaction, results);
  return results;
}

async function updateHunger(interaction, results)
{
  let hunger = 0;
  if (results.bloodSurge && !results.bloodSurge.passed)
    hunger++;
  if (results.rouse && !results.rouse.passed)
    hunger++; 
  
  const character = interaction.arguments.character?.tracked;
  if (character && hunger && character.version === '5th')
  {
    const change = {command: 'Dice Roll', hunger: hunger};
    character.updateFields(change);
    await character.save(interaction.client);
    interaction.followUps = [{
      embeds: [character.getEmbed()], 
      ephemeral: true
    }]
  } 
}