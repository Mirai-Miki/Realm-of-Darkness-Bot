"use strict";
require(`${process.cwd()}/alias`);
const API = require("@api");

/**
 * Takes a name and interaction and searches the database for a tracked character
 * @param {String} name
 * @param {Interaction} interaction
 * @returns {Object} an object containing the name and character if found.
 */
module.exports = async function getCharacter(name, interaction) {
  if (!name) return null;

  const character = {
    name: name,
    tracked: null,
  };

  const tracked = await API.getCharacter({
    client: interaction.client,
    name: name,
    user: interaction.member ? interaction.member : interaction.user,
    guild: interaction.guild,
  });

  if (tracked) character.tracked = tracked;
  return character;
};
