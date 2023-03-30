'use strict'
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { isAdminOrST } = require("../modules");
const { RealmError, ErrorCodes } = require('../Errors');
const API = require('../realmAPI');
const { ComponentCID } = require('../Constants');
const getCharacterList = require('./getCharacterList');

module.exports.findCommand = async function(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.nameLists = await getCharacterList(interaction);
  return {
    embeds: [getNamesListEmbed()], 
    components: getNamesListComponenets(interaction),
    ephemeral: true
  }
}

module.exports.findCharacter = async function(interaction)
{
  const characterId = interaction.values[0];
  if (!characterId) return;

  const character = await API.getCharacter({pk: characterId});
  if (!character) throw new RealmError({code: ErrorCodes.NoCharacter});

  return {embeds: [character.getEmbed()], components: [], content: null};
}

async function getArgs(interaction)
{
  const args = {
    player: interaction.options.getUser('player'),
    showHistory: interaction.options.getBoolean('history') ?? false,
  }

  if (args.player && !interaction.guild) 
    throw new RealmError({code: ErrorCodes.GuildRequired})
  if (args.player) 
    await isAdminOrST(interaction.member, interaction.guild.id);
  return args;
}

function getNamesListEmbed()
{
  return new EmbedBuilder()
    .setTitle("Character Find")
    .setDescription("Please select the character you wish to find.")
    .setColor("#7836ba")
}

function getNamesListComponenets(interaction)
{
  const lists = interaction.nameLists;
  const components = [];
  let count = 0;

  for (const list of lists)
  {
    components.push(new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`${ComponentCID.FindCharacter}|${count}`)
          .setPlaceholder('Choose a Character')
          .addOptions(list)
      )
    )
    count++;
  }
  return components;
}