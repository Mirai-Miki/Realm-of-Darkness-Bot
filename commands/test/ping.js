'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Replies with Pong!'),
	
	async execute(interaction) {
		console.log(interaction)
		await interaction.reply('Pong!');
	},
};