const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
const WebSocketServer = require("./modules/RoDApp/WebSocketServer.js");
const Database = require("./modules/util/Database");

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync(config.commandPath);

const PORT = 52723;
const wss = new WebSocketServer(client, PORT);

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

client.on('guildUpdate', (oldGuild, newGuild) => {
    
});

client.on('guildUnavailable', (guild) => {
    
});

client.on('guildMemberAdd', (member) => {
    
});

client.on('guildMemberRemove', (member) => {
    
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    
});

client.on('message', (mess) => {
    const prefix = config.prefix;    
    if ((!mess.content.startsWith(prefix) 
        && !mess.content.startsWith('\\'))
        || mess.author.bot)  { return };

    if (!isSendPermSet(mess))
    {
        mess.author.send("Sorry, I do not have permission to post in the " +
            `<${mess.guild.name} - ${mess.channel.name}> channel.`)
        .catch(error =>
        {
            if (error instanceof Discord.DiscordAPIError &&
                error.code == 50007 || error.code == 50013)
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
        return;
    }

    const args = mess.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const content = 
        mess.content.slice(prefix.length).trim().slice(commandName.length);
    
    const command = client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

    try 
    {
    	command.execute(mess, args, content);
    } catch (error) {
    	console.error(error);
    	mess.reply('there was an error trying to execute that command!\n' +
            'If see this error please let Mirai-Miki#6631 know.');
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

client.on('shardReconnecting', (id) => {
    /*
    try {
        client.channels.cache.get('776761322859266050').send(
            `Shard ${String(id)} is reconnecting.`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - ShardReconnecting.\n\n` + 
            `There was also Error sending a message.\n` +
            `${err}`
        );
    }
    */
});

client.on('shardResume', (id, replayedEvents) => {
    /*
    try {
        client.channels.cache.get('776761322859266050').send(
            `Shard ${String(id)} resumed.\n` +
            `There was ${String(replayedEvents)} replayed Events.`
        );
    }
    catch (err) {
        console.error(
            `The RoD Bot - ShardResume.\n` +
            `There was ${String(replayedEvents)} replayed Events.\n\n` +
            `There was also Error sending a message.\n` +
            `${err}`
        );
    } 
    */
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

// Logs into the server using the secret token
client.login(config.token);

function setActivity(client)
{
    client.user.setActivity(`${client.guilds.cache.size} Servers |` +
        ` Type ${config.prefix}rod for a list of commands`, 
        { type: 'WATCHING' });
}

function isSendPermSet(message)
{
    if (!message.guild) return true; // Not sending in a guild

    return message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES");
}