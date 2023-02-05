'use strict';
const { minToMilli, trimString } = require('../../util/misc.js');
const { Interaction } = require('discord.js');
const getCharacter = require('./getCharacter');
const { vtmResponse, getSelectRerollMenu } = require('./getRollResponse');
const RollResults = require('../../../structures/vtmV5RollResults');
const RealmError = require('../../../Errors/RealmError');
const { ErrorCodes, handleErrorDebug } = require('../../../Errors/index')


/**
 * 
 * @param {Interaction} interaction 
 */
module.exports.vtmRoll = async function(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction.arguments);
  
  interaction.discordResponse = vtmResponse(interaction, 'reroll');
  handleButtonPress(interaction);
  return interaction.discordResponse;
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

  const results = new RollResults({
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

function handleButtonPress(interaction)
{
  const filter = i => (
    i.message.interaction.id == interaction.id &&
    (i.customId === 'autoReroll' || i.customId === 'selectReroll')         
  );

  const channel = interaction.channel;
  interaction.collector = channel.createMessageComponentCollector({
    filter,
    time: minToMilli(14)
  });  

  // Start Collector and wait for a button press
  interaction.collector.on('collect', async i => {
    if (i.user.id !== interaction.user.id) {
      await i.deferReply({ ephemeral: true });
      try
      {
        await i.editReply({ content: `These buttons aren't for you!`, 
          ephemeral: true });
      }
      catch(error)
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);
      }      
    }

    await i.deferUpdate();
    if (i.customId == 'autoReroll')
    {
      // reroll
      interaction.rollResults.rerollDice();
      try
      {
        await i.editReply(await vtmResponse(interaction));
      }
      catch(error)
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);
        return;
      }                  
      interaction.collector.stop();
    }
    else if (i.customId == 'selectReroll' && i.isButton())
    {
      try
      {
        await i.editReply({components: getSelectRerollMenu(interaction)});
      }
      catch(error)
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);
      }                      
    }
    else if (i.customId == 'selectReroll' && i.isStringSelectMenu())
    {
      interaction.rollResults.rerollDice(i.values);
      try
      {
        await i.editReply(await vtmResponse(interaction));
      }
      catch(error)
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);
        return;
      }                      
      interaction.collector.stop();
    }
  });

  interaction.collector.on('end', async (i, reason) => {
    try
    {
      if (reason === 'time')
      {
        await interaction.editReply({components: []});
      }
      else (reason === 'guildDelete')
      {
        return;
      }
    }
    catch(error) 
    {
      if (error.code === 10008); //Do nothing (Unknown Message);
      else 
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);    
      }
    }
  });
}