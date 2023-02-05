'use strict';
const { Collection } = require("discord.js");
const fs = require('fs');

const characters = new Collection();
const charFiles = fs.readdirSync('./structures/characters/')
  .filter(file => file.endsWith('.js'));

for (const file of charFiles) {
  const char = require(`../structures/characters/${file}`);
  characters.set(char.getSplat().slug, char);
}


/**
 * Takes in a slug and returns a Character class
 * @param {String} splatSlug Slug for the splat Class being returned
 * @returns {Character} Character Class definition
 */
module.exports = function getCharacterClass(splatSlug)
{
  const Character = characters.get(splatSlug);
  if (!Character) throw new Error('No Character class');
  return Character;
}