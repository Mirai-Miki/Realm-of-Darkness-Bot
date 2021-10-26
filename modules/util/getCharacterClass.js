'use strict';
const { Collection } = require("discord.js");
const fs = require('fs');

const characters = new Collection();
const charFiles = fs.readdirSync('./modules/Tracker/characters')
    .filter(file => file.endsWith('.js'));

for (const file of charFiles) {
    const char = require(`../Tracker/characters/${file}`);
    characters.set(char.getSplat(), char);
}

module.exports.getCharacterClass = (splat) =>
{
    const Character = characters.get(splat);
    if (!Character) 
    {
        console.error("No Character Class");
        return undefined;
    }
    return Character;
}