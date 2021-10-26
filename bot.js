'use strict';
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");

module.exports = class Bot
{
    constructor(config)
    {
        const { token, commandPath } = config;

        this.client = new Client({intents: [
            Intents.FLAGS.GUILDS, 
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
        ]});

        this.client.commands = new Collection();
        const commandFolders = fs.readdirSync(commandPath);

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(
                `${commandPath}${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`${commandPath}${folder}/${file}`);
                this.client.commands.set(command.data.name, command);
            }
        }

        /* Event Listeners */
        const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
        	const event = require(`./events/${file}`);
        	if (event.once) {
        		this.client.once(event.name, (...args) => event.execute(...args));
        	} else {
        		this.client.on(event.name, (...args) => event.execute(...args));
        	}
        }

        // Logs into the server using the secret token
        this.client.login(token);
    }
}



