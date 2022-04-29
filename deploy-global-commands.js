'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

function pushCommands (configFile, ver)
{
	const { clientId, token, commandPath } = require(configFile);
	
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
			
			console.log(`Successfully registered ${ver} application commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

pushCommands('./config5th.json', "v5");
pushCommands('./config20th.json', "20th");
pushCommands('./configCoD.json', "CoD");