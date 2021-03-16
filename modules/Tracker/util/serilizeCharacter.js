const Database = require('../../util/Database.js');

module.exports.serializeCharacter = (character) =>
{
    let db = new Database();
    db.open('Tracker', 'Database');

    let guild = db.find(character.guild);

    if (!guild) guild = {};
    guild[character.name.toLowerCase()] = character;

    db.add(character.guild, guild);
    db.close();
}