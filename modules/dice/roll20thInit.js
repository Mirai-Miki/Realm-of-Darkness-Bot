'use strict'
const Roll = require('./Roll');
const { EmbedBuilder } = require('discord.js');

module.exports = function roll20thInit(interaction)
{
  interaction.arguments = getArgs(interaction);
  interaction.results = roll(args);
  return {embeds: [getEmbed(interaction)]};
}

function roll(args)
{
  const results = {roll: Roll.single(10), total: 0};
  results.total = results.roll + args.modifier ?? 0;
  return results;
}

function getArgs(interaction)
{
  return {
    modifier: interaction.options.getInteger("dexterity_wits"),
    character: interaction.options.getString('character'),
    notes: interaction.options.getString('notes'),
  }  
}

function getEmbed(interaction)
{
  const embed = new EmbedBuilder()
  embed.setTitle('Initiative');
  embed.setColor([186, 61, 22]);
  embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');

  embed.setAuthor({
    name: interaction.member?.displayName ?? interaction.user.username,
    iconURL: interaction.member?.displayAvatarURL() ?? 
      interaction.user.displayAvatarURL()
  });

  if (args.character)
    embed.addFields({name: 'Character', value: args.character});

  if (results.blackDice.length) embed.addFields({
    name: 'Dex + Wits', 
    value: `${args.modifier}`,
    inline: true
  });
  
  if (results.nightmareDice.length) embed.addFields({
    name: '1d10',
    value: `${interaction.results.roll}`,
    inline: true
  });

  if (args.notes) embed.addFields({
    name: 'Notes', 
    value: args.notes, 
    inline: false
  });

  if (args.spec) embed.addFields({
    name: 'Initiative of', 
    value: `\`\`\`${interaction.results.total}\`\`\``, 
    inline: true
  });
        
  const links = "\n[Website](https://realmofdarkness.app/)" +
    " | [Patreon](https://www.patreon.com/MiraiMiki)";
  embed.fields.at(-1).value += links;
  return embed;
}