'use strict';
const { EmbedBuilder } = require('discord.js');
const CodRollResults = require('../../structures/CodRollResults');
const { Emoji } = require('../../Constants');

module.exports = async function CoDRoll(interaction)
{
  interaction.arguments = getArgs(interaction);
  interaction.rollResults = new CodRollResults(interaction);
  return {content: getContent(interaction), embeds: [getEmbed(interaction)]};
}

function getArgs(interaction)
{
  return {
    pool: interaction.options.getInteger('pool'),
    bonus: interaction.options.getInteger('bonus'),
    penalty: interaction.options.getInteger('penalty'),
    spec: interaction.options.getString('speciality'),
    willpower: interaction.options.getBoolean('willpower'),
    rote: interaction.options.getBoolean('rote'),
    target: interaction.options.getInteger('target'),
    reroll: interaction.options.getInteger('reroll'),
    character: interaction.options.getString('character'),       
    notes: interaction.options.getString('notes'),
  }
}

function getContent(interaction)
{  
  const results = interaction.rollResults;
  let content = toDiceString(results.dice, interaction, true);
  if (results.roteDice.length)
  {
      content += Emoji.red_period;
      content += toDiceString(results.roteDice, interaction);
  }
  if (results.rerollDice.length)
  {
      content += Emoji.black_period;
      content += toDiceString(results.rerollDice, interaction);
  }
  if (content.length >= 2000) content = null;
  return content;
}

function toDiceString(diceResults, interaction, chanceDice=false)
{
  const args = interaction.arguments;
  const chance = interaction.rollResults.chance;
  const emotes = {
    1: {fail: Emoji.red1, sux: Emoji.green1},
    2: {fail: Emoji.red2, sux: Emoji.green2},
    3: {fail: Emoji.red3, sux: Emoji.green3},
    4: {fail: Emoji.red4, sux: Emoji.green4},
    5: {fail: Emoji.red5, sux: Emoji.green5},
    6: {fail: Emoji.red6, sux: Emoji.green6},
    7: {fail: Emoji.red7, sux: Emoji.green7},
    8: {fail: Emoji.red8, sux: Emoji.green8},
    9: {fail: Emoji.red9, sux: Emoji.green9},
    10: {fail: Emoji.red10, sux: Emoji.green10},
  }

  let mess = ''
  for (const dice of diceResults)
  {
    if (chance)
    {
      if (dice == 10) mess += Emoji.black_crit;
      else if (dice == 1 && chanceDice) mess += Emoji.botch; 
      else mess += emotes[dice].fail; 
    }
    else
    {
      if (dice >= (args.reroll ?? 10)) mess += Emoji.black_crit;                       
      else if (dice >= (args.target ?? 8)) mess += emotes[dice].sux;
      else mess += emotes[dice].fail;
    }            
    mess += ' ';
  }
  return mess;
}

function getEmbed(interaction)
{
  const args = interaction.arguments;
  const results = interaction.rollResults;
  // Create the embed
  let embed = new EmbedBuilder();
        
  embed.setAuthor({
    name: (
      interaction.member?.displayName ??
      interaction.user.displayName ??
      interaction.user.username
    ), 
    iconURL: interaction.member?.displayAvatarURL() ??
      interaction.user.displayAvatarURL()
  });

  let title = `Pool ${args.pool}`;
  if (args.bonus) title += ` | Bonus ${args.bonus}`
  if (args.penalty) title += ` | Penalty ${args.penalty}`
  if (args.willpower) title += ` | WP`;
  if (args.spec) title += ` | Spec`;
  if (args.rote) title += ` | Rote`;
  if (args.reroll) title += ` | Reroll ${args.reroll}`;
  if (args.target) title += ` | Target ${args.target}`;
  embed.setTitle(title);

  if (args.character) embed.addFields({name: "Character", value: args.character});
  
  const dice = sortDiceResults(results.dice, args, results.chance);
  const rote = sortDiceResults(results.roteDice, args);
  const reroll = sortDiceResults(results.rerollDice, args);
  
  if (dice.length) 
    embed.addFields({
      name: `${results.chance ? "Chance Dice" : "Dice"}`, 
      value: dice.join(", "), 
      inline: true
    });
  if (rote.length) embed.addFields({
    name: "Rote Dice", 
    value: rote.join(", "), 
    inline: true
  });
  if (reroll.length) embed.addFields({
    name: "Reroll Dice",
    value: reroll.join(", "),
    inline: true
  });

  if (args.spec) embed.addFields({name: "Specialty", value: `${args.spec}`});
  if (args.notes) embed.addFields({name: "Notes", value: args.notes});

  embed.setColor(results.outcome.color);
  let resultMess = ''
  if (results.total) resultMess += `Rolled: ${results.total} Sux`
  resultMess += `\n${results.outcome.toString}`;
  embed.addFields({name: 'Result', value: resultMess})

  const links = "\n[Website](https://realmofdarkness.app/)" +
      " | [Commands](https://realmofdarkness.app/cod/commands/)" +
      " | [Patreon](https://www.patreon.com/MiraiMiki)";
  embed.data.fields.at(-1).value += links;
  
  embed.setURL('https://realmofdarkness.app/');
  return embed;
}

function sortDiceResults(diceResults, args, chance=false)
{
  const sortedResults = diceResults.map((x) => x);
  sortedResults.sort((a, b) => b - a);

  const results = [];
  for (const dice of sortedResults)
  {           
      if (dice >= (args.reroll ?? 10) && dice >= (args.target ?? 8)) 
          results.push(`**${dice}**`);            
      else if (dice >= (args.target ?? 8)) results.push(`${dice}`);
      else if (dice >= (args.reroll ?? 10) && dice < (args.target ?? 8)) 
          results.push(`**~~${dice}~~**`);
      else if (chance && dice == 1) results.push(`**~~1~~**`);
      else results.push(`~~${dice}~~`);            
  }
  return results;
}