'use strict';
const Database = require('./Database.js');
const { Collection } = require("discord.js");
const fs = require('fs');

const characters = new Collection();
const charFiles = fs.readdirSync('./modules/Tracker/characters')
    .filter(file => file.endsWith('.js'));

for (const file of charFiles) {
	const char = require(`../Tracker/characters/${file}`);
	characters.set(char.getSplat(), char);
}

module.exports.isSupporter = (userId) =>
{
    const db = new Database();
    db.open('Supporters', 'Database');

    const user = db.find(userId);

    if (!user) return false;
    return true;
}

module.exports.hourToMilli = (hour) =>
{
    return this.minToMilli(hour * 60);
}

module.exports.minToMilli = (min) =>
{
    return ((min*60)*1000);
}

module.exports.correctName = (name) =>
{
    const words = name.trim().toLowerCase().split(/\s+/);
    const nameParts = []

    for (const part of words)
    {
        nameParts.push(part[0].toUpperCase() + part.substring(1));
    }

    return nameParts.join(' ');
}

module.exports.getCharacterClass = (splat) =>
{
    const Character = characters.get(character.splat);
    if (!Character) 
    {
        console.error("No Character Class");
        return undefined;
    }
    return Character;
}