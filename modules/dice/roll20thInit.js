'use strict'
const Roll = require('./Roll');
const { EmbedBuilder } = require('discord.js');
const API = require('../../realmAPI');

module.exports = async function roll20thInit(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.results = roll(interaction.arguments);
  return {embeds: [getEmbed(interaction)]};
}

function roll(args)
{
  const results = {roll: Roll.single(10), total: 0};
  results.total = results.roll + args.modifier ?? 0;
  return results;
}

async function getArgs(interaction)
{
  const args = {
    modifier: interaction.options.getInteger("dexterity_wits"),
    character: interaction.options.getString('character'),
    notes: interaction.options.getString('notes'),
  }  

  if (!args.character && interaction.guild)
  {
    const defaults = await API.characterDefaults.get(
      interaction.guild.id, interaction.user.id
    )
    
    if (defaults)
      args.character = defaults.name;
  }
  return args; 
}

function getEmbed(interaction)
{
  const args = interaction.arguments;
  const results = interaction.results;

  const embed = new EmbedBuilder()
  embed.setTitle('Initiative');
  embed.setColor([186, 61, 22]);
  embed.setURL('https://realmofdarkness.app/');

  embed.setAuthor({
    name: interaction.member?.displayName ?? interaction.user.displayName,
    iconURL: interaction.member?.displayAvatarURL() ?? 
      interaction.user.displayAvatarURL()
  });
  
  if (args.character)
    embed.addFields({name: 'Character', value: args.character});      

  if (args.notes) embed.addFields({
    name: 'Notes', 
    value: args.notes, 
    inline: false
  });

  embed.addFields({
    name: 'Dex + Wits', 
    value: `\`\`\`${args.modifier}\`\`\``,
    inline: true
  });
  
  embed.addFields({
    name: '1d10',
    value: `\`\`\`${results.roll}\`\`\``,
    inline: true
  });

  embed.addFields({
    name: 'Initiative of', 
    value: `\`\`\`${results.total}\`\`\``, 
    inline: false
  });
  return embed;
}