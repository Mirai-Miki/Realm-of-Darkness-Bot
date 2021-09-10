const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');
const guildId = "699082446729117746"

const commands = [
    // Dice Commands
	new SlashCommandBuilder()
        .setName('generalRoll')
        .setDescription('Replies with pong!'),
	new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
	new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
    // Tracker Commands
    // Tunnel Commands
    // Help Commands
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();