'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

function pushCommands (configFile, ver)
{
	const { clientId, token, commandPath } = require(configFile);
	
	const commands = [];

	const commandFiles = fs.readdirSync(
	  `${commandPath}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
	  const command = require(`${commandPath}/${file}`);
    commands.push(command.data);
	}
	
	const rest = new REST({ version: '10' }).setToken(token);
	
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