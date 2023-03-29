'use strict'
const API = require('../../realmAPI')

/**
 * Takes a name and interaction and searches the database for a tracked character
 * @param {String} name 
 * @param {Interaction} interaction 
 * @returns {Object} an object containing the name and character if found.
 */
module.exports = async function getCharacter(name, interaction)
{
  if (!name) return null;

  const character = 
  {
    name: name,
    tracked: null
  }

  const tracked = await API.getCharacter({
    name: name,
    user: interaction.member ? interaction.member : interaction.user,
    guild: interaction.guild
  });

  if (tracked) character.tracked = tracked;
  return character;
}