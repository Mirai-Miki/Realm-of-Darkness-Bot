"use strict";
const { RealmError, ErrorCodes } = require("../Errors");
const isAdminOrST = require("./isAdminOrST");
const getCharacterClass = require("./getCharacterClass");
const API = require("../realmAPI");

module.exports.new = async function (interaction, splat) {
  const CharacterClass = getCharacterClass(splat.slug);
  const options = interaction.arguments;
  options.command = "New Character";
  const char = new CharacterClass({
    client: interaction.client,
    name: options.name,
  });
  await char.setDiscordInfo({
    user: interaction.user,
    guild: interaction.guild,
  });

  char.setFields(options);
  await char.save(interaction.client);
  return { ephemeral: true, embeds: [char.getEmbed(options.notes)] };
};

module.exports.set = async function (interaction, splat) {
  const options = interaction.arguments;
  options.command = "Set Character";
  const char = await API.getCharacter({
    client: interaction.client,
    name: options.name,
    user: interaction.user,
    guild: interaction.guild ?? null,
    splat: splat.slug,
  });

  if (!char) throw new RealmError({ code: ErrorCodes.NoCharacter });
  char.setFields(options);
  await char.save(interaction.client);
  interaction.character = char;
  return { ephemeral: true, embeds: [char.getEmbed(options.notes)] };
};

module.exports.update = async function (interaction, splat) {
  const options = interaction.arguments;
  options.command = "Update Character";
  let requestedUser = interaction.user;

  // An ST is trying to change another players character
  if (options.player && !interaction.guild)
    throw new RealmError({ code: ErrorCodes.GuildRequired });
  else if (
    options.player &&
    !(await isAdminOrST(interaction.member, interaction.guild.id))
  ) {
    throw new RealmError({ code: ErrorCodes.NotAdminOrST });
  } else if (options.player) requestedUser = options.player;
  const char = await API.getCharacter({
    client: interaction.client,
    name: options.name,
    user: requestedUser,
    splat: splat.slug,
    guild: interaction.guild ?? null,
  });

  if (!char) throw new RealmError({ code: ErrorCodes.NoCharacter });
  char.updateFields(options);

  await char.save(interaction.client);
  interaction.character = char;
  return { ephemeral: true, embeds: [char.getEmbed(options.notes)] };
};
