'use strict'
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const isAdminOrST = require("./isAdminOrST");
const { RealmError, ErrorCodes } = require('../Errors');
const API = require('../realmAPI');
const { ComponentCID } = require('../Constants');
const getCharacterList = require('./getCharacterList');

module.exports = async function deleteCharacter(interaction)
{
  interaction.arguments = await getArgs(interaction);
  interaction.nameLists = await getCharacterList(interaction);
  return {
    content: null, 
    embeds: [getNamesListEmbed()], 
    components: getNamesListComponenets(interaction)
  }
}

module.exports.deleteCharacters = async function(interaction)
{
  const characterIds = interaction.values;
  if (!characterIds) return;

  const names = await API.deleteCharacters(characterIds);
  return {
    embeds: [getConfirmationEmbed(names, false)], 
    components: [], 
    content: null
  };
}

async function getArgs(interaction)
{
  const args = {
    player: interaction.options.getUser('player')
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
    .setTitle("Character Delete")
    .setDescription(
      "Please select the characters you wish to Delete." +
      "\nChoose carefully as this is a permanent action!!"
    )
    .setColor("#b31b2f")
}

function getConfirmationEmbed(names, disconnected)
{
  let disconnect = 'deleted these characters:';
  if (disconnected) disconnect = 'removed these characters from this server:'
  return new EmbedBuilder()
    .setTitle("Characters Deleted")
    .setDescription(`You have ${disconnect}\n` + "- " + names.join('\n- '))
    .setColor("#b31b2f")
}

function getNamesListComponenets(interaction)
{
  const lists = interaction.nameLists;
  const components = [];
  let count = 0;

  const disconnect = interaction.arguments.player ? true : false

  for (const list of lists)
  {
    components.push(new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`${ComponentCID.DeleteCharacters}|${count}|${disconnect}`)
          .setPlaceholder('Choose a Character')
          .addOptions(list)
          .setMaxValues(list.length)
          .setMinValues(1)
      )
    )
    count++;
  }
  return components;
}