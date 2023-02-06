'use strict'
const { RealmError, ErrorCodes } = require('../Errors')
const { isAdminOrST, getCharacterClass } = require('../modules');
const API = require('../realmAPI');

module.exports.new = async function(interaction, splat)
{
  const CharacterClass = getCharacterClass(splat.slug)
  const options = interaction.arguments;
  const char = new CharacterClass({
    name: options.name,
    user: interaction.member ? interaction.member : interaction.user,
    guild: interaction.guild
  });
  
  char.setFields(options);

  //TODO Set history
  await API.newCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed(options.notes)]};
}

module.exports.set = async function(interaction, splat)
{
  const options = interaction.arguments;
  const char = await API.getCharacter(
    options.name, 
    interaction.user,
    {
      guild: interaction.guild ?? null,
      splatSlug: splat.slug
    }
  );
  
  if (!char) throw new RealmError({code: ErrorCodes.NoCharacter});
  char.setFields(options);

  //TODO Update history
  
  await API.saveCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed()]};
}

module.exports.update = async function(interaction, splat)
{
  const options = interaction.arguments;
  let requestedUser = interaction.user;
  
  // An ST is trying to change another players character
  if (options.player && !interaction.guild)
    throw new RealmError({code: ErrorCodes.GuildRequired});
  else if (options.player && 
    !await isAdminOrST(interaction.member, interaction.guild.id))
  {  
    throw new RealmError({code: ErrorCodes.NotAdminOrST});
  }
  else if (options.player) requestedUser = options.player;

  const char = await API.getCharacter(
    options.name, 
    requestedUser,
    {
      guild: interaction.guild ?? null,
      splatSlug: splat.slug
    }
  );
  
  if (!char) throw new RealmError({code: ErrorCodes.NoCharacter});
  char.updateFields(options);

  //TODO Update history
  
  await API.saveCharacter(char);
  return {ephemeral: true, embeds: [char.getEmbed()]};
}