'use strict'
const API = require('../realmAPI');

module.exports = async function isAdminOrST(member, guildId)
{
  if (!member || !guildId) throw new Error('Need a member && guildID');

  const roles = await API.getSTRoles(interaction.guild.id);
  if (!member.permissions.has("ADMINISTRATOR") && 
    !member.roles.cache.hasAny(...roles))
  {
    return false;
  }
  else return true;
}