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

module.exports.canSendMessage = (channel) =>
{
    if (!channel.guild) return true; // Not sending in a guild

    if (!channel.permissionsFor(channel.client.user.id).has("VIEW_CHANNEL"))
    {
        return false;
    }
    else if (!channel.permissionsFor(channel.client.user.id).has("SEND_MESSAGES"))
    {
        return false;
    }
    else return true;
}

module.exports.canEmbed = (channel) =>
{
    if (!channel.guild) return true; // Not sending in a guild

    if (!channel.permissionsFor(channel.client.user.id).has("EMBED_LINKS"))
    {
        return false;
    }
    else return true;
}