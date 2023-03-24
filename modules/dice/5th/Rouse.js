'use strict'
const { trimString } = require('../../misc');
const getCharacter = require('./getCharacter');
const Roll = require('../Roll');
const { EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {Interaction} interaction 
 * @returns {DiscordResponse} Response to send to the discord API
 */
module.exports = async function rouse(interaction)
{
  interaction.args = await getArgs(interaction);
  interaction.rollResults = roll(interaction.args.reroll);

  return {embeds: [getEmbed(interaction)]};
}

async function getArgs(interaction)
{
  return {
    character: await getCharacter(
      trimString(interaction.options.getString('character')),
      interaction
    ),
    reroll: interaction.options.getBoolean('reroll'),
    notes: interaction.options.getString('notes')
  }
}

function roll(reroll)
{
  const rollResults = {
    dice: [Roll.single(10)],
    toString: '```ansi\n[2;31mHunger Increased[0m[2;31m[0m\n```',
    passed: false,
    color: '#8c0f28'
  };
  if (reroll) rollResults.dice.push(Roll.single(10));

  for (const dice of rollResults.dice)
  {
    if (dice >= 6)
    {
      rollResults.passed = true;
      rollResults.toString = '```Hunger Unchanged```';
      rollResults.color = '#1c1616';
    }
  }
  return rollResults;
}

function getEmbed(interaction)
{
  const results = interaction.rollResults;
  const embed = new EmbedBuilder();
  embed.setAuthor({
    name: (
      interaction.member?.displayName ??
      interaction.user.username
    ), 
    iconURL: interaction.member?.displayAvatarURL() ??
      interaction.user.displayAvatarURL()
  });

  embed.setTitle('Rouse Check');
  embed.setColor(results.color);
  embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
        
  if (!results.passed)
    embed.setThumbnail('https://cdn.discordapp.com/attachments/7140' +
    '50986947117076/886855116035084288/RealmOfDarknessSkullnoBNG.png');
  
  if (interaction.args.character)
  {
    const char = interaction.args.character;
    embed.addFields({name: "Character", value: char.name});
    if (char.tracked?.thumbnail) embed.setThumbnail(char.tracked.thumbnail);
  }

  embed.addFields({name: "Rouse Dice", value: `${results.dice.join(' ')}`});
  if (interaction.args.notes) 
    embed.addFields({name: "Notes", value: interaction.args.notes});
  embed.addFields({name: "Result", value: results.toString});

        
  const links = "\n[Website](https://realmofdarkness.app/)" +
    " | [Commands](https://realmofdarkness.app/v5/commands/)" +
    " | [Patreon](https://www.patreon.com/MiraiMiki)";
    
  embed.data.fields.at(-1).value += links;
  return embed;
}