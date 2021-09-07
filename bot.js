'use strict';

const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
//const WebSocketServer = require("./modules/RoDApp/WebSocketServer.js");
const Database = require("./modules/util/Database");
const Tunnel = require("./modules/Tunnel/Tunnel.js");

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync(config.commandPath);

//const PORT = 52723;
//const wss = new WebSocketServer(client, PORT);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(
        `${config.commandPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${config.commandPath}${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

/* Event Listeners */

client.on("ready", () => {
    console.log("Connected as: " + client.user.tag);
    setActivity(client);
    displayStats();

    let db = new Database();
    db.open('Contests', 'Database');
    db.deleteAll();
});

client.on('guildCreate', (guild) => {
    setActivity(client);
});

client.on('guildDelete', (guild) => {
    setActivity(client);
});

client.on('message', (mess) => {
    const prefix = config.prefix;    
    if (mess.author.bot)  { return };

    if (mess.content.startsWith(prefix) || mess.content.startsWith('\\'))
    {
        if (!canSend(mess)) return;

        const args = mess.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const content = 
            mess.content.slice(prefix.length).trim().slice(commandName.length);

        const command = client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName));

	    if (command) 
        {
            commandCount(command.name);
            userCount(mess.author.id);

            try 
            {
            	command.execute(mess, args, content);
            } 
            catch (error) {
            	console.error(error);
            	mess.reply('there was an error trying to execute that command!\n' +
                    'If see this error please let Mirai-Miki#6631 know.');
            }
            return;
        }        
    }

    const db = new Database();
    db.open("Tunnel", 'Database');
    const toChannelID = db.find(mess.channel.id);
    if (toChannelID)
    {
        if (!canSend(mess)) return;
        else if (Tunnel.canTunnel(mess, toChannelID))
        {
            try 
            {
                Tunnel.toChannel(mess, toChannelID)
            } 
            catch (error) {
            	console.error(error);
            	mess.reply('there was an error trying to Tunnel!\n' +
                    'If see this error please let Mirai-Miki#6631 know.');
            }
        }
    }
});

client.on('shardDisconnect', (closeEvent, id) => {
    try {
        client.channels.cache.get('776761322859266050').send(
            `Shard ${String(id)} disconnected.\n` +
            `Code: ${String(closeEvent.code)}\n` +
            `Reason: ${closeEvent.reason}`
        );
    }
    catch (error) {
        console.error(
            `The RoD Bot - ShardDisconnect.\n` +
            `Shard ${String(id)} disconnected.\n` +
            `Code: ${String(closeEvent.code)}\n\n` +
            `There was also Error sending a message.\n` +
            `${error}`
        );
    }    
});

client.on('shardError', (error, id) => {
    try {
        client.channels.cache.get('776761322859266050').send(
            `Shard ${String(id)} encounted an error.\n` +
            `Name: ${error.name}\n` +
            `Message: ${error.message}`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - ShardError.` +
            `Shard ${String(id)} encounted an error.\n` +
            `Name: ${error.name}\n` +
            `Message: ${error.message}\n\n` +
            `There was also Error sending a message.\n`
            `${err}`
        );
    }  
});

client.on('shardReady', (id, unavailGuilds) => {
    try {
        client.channels.cache.get('776761322859266050').send(
            `Shard ${String(id)} is ready.\n` +
            `There are ${unavailGuilds ? unavailGuilds.size : '0'}` +
            ` unavailable guilds.`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - ShardReady.\n` +
            `Shard ${String(id)} is ready.\n` +
            `There are ${unavailGuilds ? unavailGuilds.size : '0'}` +
            ` unavailable guilds.\n\n` +
            `There was also Error sending a message.\n
            ${err}`
        );
    }  
});

client.on('error', (error) => {
    try {
        client.channels.cache.get('776761322859266050').send(
            `An Error was encounted.\n` +
            `Error Name: ${error.name}\n` +
            `Message: ${error.message}`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - Encounted an Error.\n` +
            `Name: ${error.name}\n` +
            `Message: ${error.message}\n\n` + 
            `There was also Error sending a message.\n` +
            `${err}`
        );
    } 
});

client.on('warn', (info) => {
    try {
        client.channels.cache.get('776761322859266050').send(
            `${info}`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - Encounted a Warning.\n` +
            `Message: ${info}\n\n` +
            `There was also Error sending a message.\n` +
            `${err}`
        );
    } 
});

function setActivity(client)
{
    let userCount = 0;
    client.guilds.cache.each(guild => userCount += guild.memberCount);
    client.user.setActivity(`${client.guilds.cache.size} Chronicles and` +
        ` ${userCount} Players | Type ${config.prefix}rod for a list of commands`, 
        { type: 'WATCHING' });
}

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
            if (error instanceof Discord.DiscordAPIError &&
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
            else throw error; // Unknown error
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

function displayStats()
{
    const channel = client.channels.cache.get(config.statChannel);
    
    const db = new Database();
    db.open("StatMessages", 'Database');


    const userDB = new Database();
    userDB.open("UserCount", 'Database');
    const userCountID = db.find("userCount");
    if (!userCountID)
    {
        channel.send(`User Count: ${userDB.length()}`)
            .then(message =>
                {
                    db.add("userCount", message.id);
                    db.close();
                });
    }
    else
    {
        channel.messages.fetch(userCountID).then(message => 
            {
                message.edit(`User Count: ${userDB.length()}`)
            });
    }


    const commandDB = new Database();
    commandDB.open("CommandUsage", 'Database');
    const commandUsageID = db.find("commandUsage");
    if (!commandUsageID)
    {
        let content = '';

        for (const [key, value] of Object.entries(commandDB.db)) {
            content += `${key}: ${value}\n`;
        }

        channel.send(`${content}`)
            .then(message =>
                {
                    db.add("commandUsage", message.id);
                    db.close();
                });
    }
    else
    {
        let content = '';

        for (const [key, value] of Object.entries(commandDB.db)) {
            content += `${key}: ${value}\n`;
            
        }
        console.log(content)

        channel.messages.fetch(commandUsageID).then(message => 
            {
                console.log()
                message.edit(`${content}`)
            });
    }
}

// Logs into the server using the secret token
client.login(config.token);