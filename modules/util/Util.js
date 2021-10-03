'use strict';
const Database = require('./Database.js');

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

module.exports.slugifiy = (str) =>
{
    return str.toLowerCase().trim().replace(/\s+/g, '_')
}