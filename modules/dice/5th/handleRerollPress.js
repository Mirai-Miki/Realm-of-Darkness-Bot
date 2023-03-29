'use strict'
const { ErrorCodes, handleErrorDebug, RealmError } = require('../../../Errors');
const HunterV5RollResults = require('../../../structures/HunterV5RollResults');
const { minToMilli } = require('../../misc');

module.exports = function handleRerollPress(interaction, getEmbed, getComponents, getContent)
{
  const filter = i => (
    i.message.interaction.id === interaction.id &&
    (i.customId === 'autoReroll' || i.customId === 'selectReroll' ||
    i.customId === 'chooseOverreach' || i.customId === 'chooseDespair')         
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
        await i.editReply({
          embeds: [getEmbed(interaction)], 
          components: [],
          content: getContent(interaction)
        });
        const update = await updateWillpower(interaction);
        if (update) i.followUp(update);
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
        await i.editReply({components: getComponents(interaction, 'menu')});
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
        await i.editReply({
          embeds: [getEmbed(interaction)], 
          components: [],
          content: getContent(interaction)
        });
        const update = await updateWillpower(interaction);
        if (update) i.followUp(update);
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
    else if (i.customId == 'chooseOverreach' || i.customId == 'chooseDespair')
    {
      let choice;
      if (i.customId === 'chooseOverreach' && interaction.rollResults.crit)
        choice = HunterV5RollResults.ResultType.overreachCrit;
      else if (i.customId === 'chooseOverreach')
        choice = HunterV5RollResults.ResultType.overreach;
      else choice = HunterV5RollResults.ResultType.despair

      interaction.rollResults.setOutcome(choice);      
      try
      {
        const message = {
          embeds: [getEmbed(interaction)], 
          components: []
        };
        if (choice !== HunterV5RollResults.ResultType.despair)
          message.components = getComponents(interaction);
        await i.editReply(message);
      }
      catch(error)
      {
        const err = 
          new RealmError({cause: error.stack, code: ErrorCodes.DiscordAPIError});
        handleErrorDebug(err, interaction);
        return;
      } 
      if (choice === HunterV5RollResults.ResultType.despair) 
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

async function updateWillpower(interaction)
{
  const character = interaction.arguments.character?.tracked;
  if (!character || character.version !== '5th') return;

  const change = {command: 'Dice Roll', willpowerSup: 1};
  character.updateFields(change);
  await character.save(interaction.client)
  return {embeds: [character.getEmbed()], ephemeral: true};
}