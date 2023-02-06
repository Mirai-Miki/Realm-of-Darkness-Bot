'use strict';
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token } = require('./configCoD.json');

const client = new Client({intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.DIRECT_MESSAGES
]});

/* Loading Commands in Client */
client.commands = new Collection();
const commandFiles = 
  fs.readdirSync('./commands/5th').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/cod/${file}`);
  client.commands.set(command.data.name, command);
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