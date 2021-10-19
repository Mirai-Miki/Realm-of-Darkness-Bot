'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

// 20th
function v20 ()
{
	const { clientId, token, commandPath } = require('./config20th.json');

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
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log('Successfully registered v20 application commands.');
		} catch (error) {
			console.error(error);
		}
	})();
}

function v5 ()
{
	const { clientId, token, commandPath } = require('./config5th.json');

	
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
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
			
			console.log('Successfully registered v5 application commands.');
		} catch (error) {
			console.error(error);
		}
	})();
}

v20();
v5();