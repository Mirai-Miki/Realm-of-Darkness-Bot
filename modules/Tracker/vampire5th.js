'use strict'
const { Vampire5th } = require('../../structures');
const { RealmError, ErrorCodes } = require('../../Errors')
const { isAdminOrST } = require('../index');
const { Splats } = require('../../Constants');
const API = require('../../realmAPI');

module.exports.new = async function(interaction)
{
  const args = getArgs(interaction);
  const char = new Vampire5th({
    name: args.name,
    user: interaction.member ? interaction.member : interaction.user,
    guild: interaction.guild
  });
  
  setFields(args, char);

  //TODO Set history
  await API.newCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed(args.notes)]};
}

module.exports.set = async function(interaction)
{
  const args = getArgs(interaction);
  const char = await API.getCharacter(
    args.name, 
    requestedUserId,
    {
      guild: interaction.guild ?? null,
      splatSlug: Splats.vampire5th.slug
    }
  );
  
  if (!char) throw new RealmError({code: ErrorCodes.NoCharacter});
  setFields(args, char);

  //TODO Update history
  
  await API.saveCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed()]};
}

module.exports.update = async function(interaction)
{
  const args = getArgs(interaction);
  let requestedUser = interaction.user;
  
  // An ST is trying to change another players character
  if (args.player && !interaction.guild)
    throw new RealmError({code: ErrorCodes.GuildRequired});
  else if (args.player && !await isAdminOrST(interaction.member, interaction.guild.id))
    throw new RealmError({code: ErrorCodes.NotAdminOrST});
  else if (args.player) requestedUserId = args.player.id;

  const char = await API.getCharacter(
    args.name, 
    requestedUser,
    {
      guild: interaction.guild ?? null,
      splatSlug: Splats.vampire5th.slug
    }
  );
  
  if (!char) throw new RealmError({code: ErrorCodes.NoCharacter});
  updateFields(args, char);

  //TODO Update history
  
  await API.saveCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed()]};
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