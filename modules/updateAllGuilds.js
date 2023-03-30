'use strict'
const API = require('../realmAPI');

module.exports = async function updateAllGuilds(client)
{
  const guilds = client.guilds.cache;

  guilds.forEach(async (guild) => {
    await API.updateGuild(guild)
  })
}