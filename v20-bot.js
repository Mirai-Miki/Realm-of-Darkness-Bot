'use strict';
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token, commandPath, componentPath } = require('./config20th.json');

const client = new Client({intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.DIRECT_MESSAGES
]});

client.commands = new Collection();
const commandFolders = fs.readdirSync(commandPath);
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(
        `${commandPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commandPath}${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

client.components = new Collection();
const componentsFolders = fs.readdirSync(componentPath);
for (const folder of componentsFolders) {
    const componentFiles = fs.readdirSync(
        `${componentPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of componentFiles) {
        const component = require(`${componentPath}${folder}/${file}`);
        client.components.set(component.name, component);
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