const Database = require('../../util/Database.js');

module.exports.saveCharacter = (character) =>
{
    let db = new Database();
    db.open('Tracker', 'Database');

    let user = db.find(character.user.id);

    if (!user) user = {};
    user[character.name] = character;

    db.add(character.user.id, user);
    db.save();
}

module.exports.getCharacter = (name, userId) =>
{
    const db = new Database();
    db.open('Tracker', 'Database');

    const user = db.find(userId);

    if (!user) return undefined;
    const character = user[name];
    return character;
}

module.exports.isSupporter = (userId) =>
{
    const db = new Database();
    db.open('Supporters', 'Database');

    const user = db.find(userId);

    if (!user) return false;
    return true;
}