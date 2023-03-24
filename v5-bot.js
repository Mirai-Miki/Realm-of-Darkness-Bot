'use strict';
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require('./config5th.json');

const client = new Client({intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages
]});

/* Loading Commands in Client */
client.commands = new Collection();
const commandFiles = 
  fs.readdirSync('./commands/5th').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/5th/${file}`);
  client.commands.set(command.data.name, command);
}

/* Loading Component Events in Client */
client.components = new Collection();
const componentFiles = 
  fs.readdirSync('./components/5th').filter(file => file.endsWith('.js'));
for (const file of componentFiles) {
  const component = require(`./components/5th/${file}`);
  client.components.set(component.name, component);
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