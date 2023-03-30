'use strict';
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,
  ButtonBuilder, ButtonStyle } = require('discord.js');
const { Emoji } = require('../../../Constants');
const HunterV5RollResults = require('../../../structures/HunterV5RollResults');

module.exports.getEmbed = function(interaction)
{
  const args = interaction.arguments;
  const results = interaction.rollResults;
  const embed = new EmbedBuilder();

  // Create Title
  let title = `Pool ${results.totalPool}`;
  if (args.desperation) title += ` | Desperation ${args.desperation}`;
  if (args.difficulty) title += ` | Difficulty ${args.difficulty}`;
  if (args.spec) title += ' | Spec';
  embed.setTitle(title);
  embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
  embed.setColor(results.outcome.color);

  embed.setAuthor({
    name: (
      interaction.member?.displayName ?? interaction.user.username
    ), 
    iconURL: interaction.member?.displayAvatarURL() ??
      interaction.user.displayAvatarURL()
  });

  if (results.reroll)
  {
    embed.addFields({
      name: `Rerolled ${results.reroll.length} Dice`, 
      value: `${results.reroll.join(', ')}`
    });
  }

  if (args.character)
  {
    embed.addFields({
      name: 'Character',
      value: args.character.name
    });

    if (args.character.tracked?.thumbnail)
      embed.setThumbnail(args.character.tracked.thumbnail);
  }

  // Add Dice fields
  if (results.dice.length) 
  {
    embed.addFields({
      name: 'Dice',
      value: `${results.dice.join(' ')}`,
      inline: true
    })
  }

  if (results.desperationDice.length)
  {
    embed.addFields({
      name: 'Desperation',
      value: `${results.desperationDice.join(' ')}`,
      inline: true
    })
  }

  // Add Spec and Notes Fields
  if (args.spec) embed.addFields({name: 'Specialty', value: args.spec});
  if (args.notes) embed.addFields({name: 'Notes', value: args.notes});

  // Add result Fields
  let resultMessage = ""
  if (!args.difficulty) resultMessage = `Rolled: ${results.total} Sux`;
  else resultMessage = `${results.total} sux vs diff ${args.difficulty}`;

  if (args.difficulty && results.margin >= 0)
    resultMessage += `\nMargin of ${results.margin}`;
  else if (args.difficulty && results.margin < 0) 
    resultMessage += `\nMissing ${results.margin * -1}`;
  
  resultMessage += `\n${results.outcome.toString}`;
  embed.addFields({name: "Result", value: resultMessage});

  // Adding links to bottom of embed
  const links = "\n[Website](https://realmofdarkness.app/)" +
    " | [Commands](https://realmofdarkness.app/v5/commands/)" +
    " | [Dice %](https://realmofdarkness.app/v5/dice/)" +
    " | [Patreon](https://www.patreon.com/MiraiMiki)";
  embed.data.fields.at(-1).value += links;

  return embed;
}

function getV5Buttons(interaction)
{
  const buttonRow = new ActionRowBuilder();
  
  if (interaction.rollResults.resultType === HunterV5RollResults.ResultType.choose)
  {
    buttonRow.addComponents(
        new ButtonBuilder()
            .setCustomId('chooseOverreach')
            .setLabel('Choose Overreach')
            .setStyle(ButtonStyle.Danger),
    );
    buttonRow.addComponents(
        new ButtonBuilder()
            .setCustomId('chooseDespair')
            .setLabel('Choose Despair')
            .setStyle(ButtonStyle.Danger),
    );
    return [buttonRow];
  }
  
  if (interaction.rollResults.canReroll)
  {
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId('autoReroll')
        .setLabel('Reroll Failures')
        .setStyle(ButtonStyle.Primary),
    );
  }
  
  if (interaction.rollResults.dice.length)
  { 
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId('selectReroll')
        .setLabel('Select Reroll')
        .setStyle(ButtonStyle.Secondary),
    );
  }
  
  if (buttonRow.components.length) return [buttonRow];
  else return [];
}

module.exports.getContent = function(interaction)
{
  let content = "";
  // Result Loop
  for (const dice of interaction.rollResults.dice) 
  {
    // Adding each dice emoji to the start of the message
    if (dice <= 5) content += Emoji.hunter_fail;
    else if (dice <= 9) content += Emoji.hunter_pass;
    else content += Emoji.hunter_crit;
    content += ' ';
  }

  for (const dice of interaction.rollResults.desperationDice)
  {
    if (dice == 1) content += Emoji.despair;
    else if (dice <= 5) content += Emoji.desperation_fail;
    else if (dice <= 9) content += Emoji.desperation_pass;
    else content += Emoji.desperation_crit;
  }
  return ((content.length > 2000) ? null : content);
}

function getSelectRerollMenu(interaction)
{
  let sortedRolls = interaction.rollResults.dice.map(x => x);
  sortedRolls.sort((a, b) => a - b);
  const options = [];
  const count = {};
  
  for (const dice of sortedRolls)
  {      
    let description;
    if (dice < 6) description = 'Fail';
    else if (dice < 10) description = 'Success';
    else description = 'Critical';
    let value;
    if (count[dice])
    {
      count[dice] += 1;
      value = `${dice} (${count[dice]})`;
    }
    else
    {
      value = `${dice}`;
      count[dice] = 1;
    }
    options.push(
    {
      label: `${dice}`,
      description: description,
      value: value,
    });
    if (options.length >= 25) break;
  }
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selectReroll')
        .setPlaceholder('Select Dice to Reroll')
        .setMinValues(1)
        .setMaxValues(options.length < 6 ? options.length : 6)
        .addOptions(options),
    );
  
  return [row];
}

module.exports.getComponents = function(interaction, type='Buttons')
{
  if (type === "Buttons") return getV5Buttons(interaction);
  else return getSelectRerollMenu(interaction);
}