'use strict';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

function pushCommands (configFile, ver, toggle=true)
{
	const { clientId, token, commandPath } = require(configFile);

	const guildId = "699082446729117746"
	
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
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: toggle ? commands : new Map},
			);
			
			console.log(`Successfully registered ${ver} application commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

pushCommands('./config5th.json', "v5", true);
pushCommands('./config20th.json', "20th", true);
//pushCommands('./configCoD.json', "CoD", false);