'use strict';

const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token, commandPath } = require("./config.json");
//const WebSocketServer = require("./modules/RoDApp/WebSocketServer.js");

const client = new Client({intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
]});

client.commands = new Collection();
const commandFolders = fs.readdirSync(commandPath);

//const PORT = 52723;
//const wss = new WebSocketServer(client, PORT);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(
        `${commandPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commandPath}${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

/* Event Listeners */
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Logs into the server using the secret token
client.login(token);