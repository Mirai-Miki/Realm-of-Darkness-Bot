'use strict';
const Database = require("../modules/util/Database");
const Tunnel = require("../modules/Tunnel/Tunnel.js");
const { DiscordAPIError } = require("discord.js");

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {
        if (message.author.bot)  { return };

        const db = new Database();
        db.open("Tunnel", 'Database');
        const toChannelId = db.find(message.channel.id);
        if (toChannelId)
        {
            if (!canSend(message)) return;
            else if (Tunnel.canTunnel(message, toChannelId))
            {
                try 
                {
                    Tunnel.toChannel(message, toChannelId)
                } 
                catch (error) {
                	console.error(error);
                	message.reply('there was an error trying to Tunnel!\n' +
                        'If see this error please let Mirai-Miki#6631 know.');
                }
            }
        }
    },
};

function canSend(mess)
{
    if (!mess.guild) return true; // Not sending in a guild
    
    if (!mess.channel.permissionsFor(client.user.id).has("SEND_MESSAGES"))
    {
        mess.author.send("Sorry, I do not have permission to post in the " +
            `<${mess.guild.name} - #${mess.channel.name}> channel.\n` +
            'Please enable "Send Messages" and "Embed Linds" in any channel' +
            ' you want me to work in.')
        .catch(error =>
        {
            if (error instanceof DiscordAPIError &&
                error.code == 50007)
            {
                // Cannot send DM to user. Sending to debug log
                client.channels.cache.get('776761322859266050').send(
                    `DiscordAPIError: ${error.code}\n` +
                    `Permissions not set in guild <${mess.guild.name}>, ` +
                    `channel <${mess.channel.name}>` +
                    `\nFailed to DM user ` +
                    `${mess.author.username}#${mess.author.discriminator}` +
                    `\n<@${mess.author.id}>`
                );            
            }
            else console.error(error); // Unknown error
        });
        return false;
    }
    else if (!mess.channel.permissionsFor(client.user.id).has("EMBED_LINKS"))
    {
        mess.reply('Sorry, I need the "Embed Links" permissions in this' +
            ' channel to function correctly.');
        return false;
    }
    else return true;
}

function commandCount(commandName)
{
    const db = new Database();
    db.open("CommandUsage", 'Database');
    let count = db.find(commandName);
    if (!count) count = 0;
    count++;
    db.add(commandName, count);
    db.close();    
}

function userCount(userID)
{
    const db = new Database();
    db.open("UserCount", 'Database');
    let count = db.find(userID);
    if (!count) count = 0;
    count++;
    db.add(userID, count);
    db.close();
}