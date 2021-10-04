'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token, commandPath } = require('./config.json');
const fs = require('fs');

const guildId = "699082446729117746"

const commands = [];
const commandFolders = fs.readdirSync(commandPath);


for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(
        `${commandPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commandPath}${folder}/${file}`);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: new Map },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();