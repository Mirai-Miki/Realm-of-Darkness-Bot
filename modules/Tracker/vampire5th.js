'use strict'
const { Vampire5th } = require('../../structures');
const { RealmError, ErrorCodes } = require('../../Errors')
const API = require('../../realmAPI');

module.exports.new = async function(interaction)
{
  interaction.args = getArgs(interaction);
  const char = new Vampire5th({
    name: interaction.args.name,
    user: interaction.member ? interaction.member : interaction.user,
    guild: interaction.guild
  });
  interaction.character = char;
  
  setFields(interaction.args, char);
  await API.newCharacter(char);
  return char.getEmbed();
}

module.exports.set = async function(interaction)
{

}

module.exports.update = async function(interaction)
{
  const args = getArgs(interaction);
  interaction.args = args;
  const requestedUserId = this.interaction.user.id;
  
  // An ST is trying to change another players character
  if (args.player && !interaction.guild)
    throw new RealmError({code: ErrorCodes.GuildRequired});
  else if (args.player)
  {
    const member = interaction.member;
    const roles = await API.getSTRoles(interaction.guild.id)
  }
}

function getArgs(interaction)
{
  return {
    player: interaction.options.getUser('player'),
    name: interaction.options.getString('name'),
    exp: interaction.options.getInteger('exp'),                      
    notes: interaction.options.getString('notes'),
    nameChange: interaction.options.getString('change_name'),
    thumbnail: interaction.options.getString('image'),
    colour: interaction.options.getString('colour'),
    willpower: interaction.options.getInteger('willpower'),            
    health: interaction.options.getInteger('health'),
    willpowerSup: interaction.options.getInteger('willpower_superficial'),
    willpowerAgg: interaction.options.getInteger('willpower_agg'),
    healthSup: interaction.options.getInteger('health_superficial'),
    healthAgg: interaction.options.getInteger('health_agg'),
    hunger: interaction.options.getInteger('hunger'),
    humanity: interaction.options.getInteger('humanity'),
    stains: interaction.options.getInteger('stains'),  
  }
}

function setFields(args, char)
{
  if (args.nameChange != null) char.name = args.nameChange;  
  if (args.exp != null) char.exp.setTotal(args.exp);
  if (args.color != null) char.color = args.color;
  if (args.thumbnail === 'none') char.thumbnail = null;
  else if (args.thumbnail != null) char.thumbnail = args.thumbnail;
  
  if (args.willpower != null) char.willpower.setTotal(args.willpower);
  if (args.health != null) char.health.setTotal(args.health);
  if (args.willpowerSup != null) char.willpower.setSuperfical(args.willpowerSup);
  if (args.willpowerAgg != null) char.willpower.setAgg(args.willpowerAgg);
  if (args.healthSup != null) char.health.setSuperfical(args.healthSup);
  if (args.healthAgg != null) char.health.setAgg(args.healthAgg);
  if (args.hunger != null) char.hunger.setCurrent(args.hunger);
  if (args.humanity != null) char.humanity.setCurrent(args.humanity);
  if (args.stains != null) char.humanity.setStains(args.stains);
}

function updateFields(args, char)
{
  if (args.exp && args.exp < 0) char.exp.updateCurrent(args.exp);
  else if (args.exp != null) char.exp.incTotal(args.exp);
  
  if (args.willpower != null) char.willpower.updateCurrent(args.willpower);  
  if (args.health != null) char.health.updateCurrent(args.health);
  if (args.willpowerSup != null) char.willpower.takeSuperfical(args.willpowerSup);
  if (args.willpowerAgg != null) char.willpower.takeAgg(args.willpowerAgg);
  if (args.healthSup != null) char.health.takeSuperfical(args.healthSup);
  if (args.healthAgg != null) char.health.takeAgg(args.healthAgg);
  if (args.hunger != null) char.hunger.updateCurrent(args.hunger);
  if (args.humanity != null) char.humanity.updateCurrent(args.humanity);
  if (args.stains != null) char.humanity.takeStains(args.stains);
}

function getEmbed(interaction)
{

}