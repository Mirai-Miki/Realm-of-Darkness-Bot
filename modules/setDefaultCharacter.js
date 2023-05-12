'use strict'
const { EmbedBuilder } = require("discord.js");
const { RealmError, ErrorCodes } = require('../Errors');
const API = require('../realmAPI');

module.exports = async function setDefaultCharacter(interaction)
{
  const level = await API.getSupporterLevel(interaction.user.id);
  if (level === 0) throw new RealmError({code: ErrorCodes.RequiresFledgling});
  interaction.arguments = await getArgs(interaction);

  return {
    embeds: [getEmbed()],
    ephemeral: true
  }
}

async function getArgs(interaction)
{
  const args = {
    name: interaction.options.getString('name'),
    auto_hunger: interaction.options.getBoolean('auto_hunger') ?? false,
  }

  if (!interaction.guild) 
    throw new RealmError({code: ErrorCodes.GuildRequired});
  return args;
}

function getEmbed()
{
  const embed = new EmbedBuilder()
  embed.setDescription("Defaults set");
  embed.setColor("#25ad1d");
  return embed;
}