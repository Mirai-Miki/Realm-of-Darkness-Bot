'use strict'
const API = require('../realmAPI');

module.exports = async function commandDatabaseUpdate(interaction)
{
  if (interaction.guild) await API.updateGuild(interaction.guild);
  const user = interaction.member ?? interaction.user;
  await API.updateUser(user, true);
  API.updateCommandStat(interaction);
}