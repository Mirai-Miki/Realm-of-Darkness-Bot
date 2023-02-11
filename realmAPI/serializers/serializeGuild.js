'use strict'

module.exports = function serializeGuild(guild)
{
  if (!guild) return null;
  else return {
    id: guild.id,
    name: guild.name,
    iconURL: guild.iconURL()
  }
}