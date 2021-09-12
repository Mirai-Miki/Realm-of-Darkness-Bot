'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command!'),
	
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('quickReroll')
					.setLabel('Quick Reroll')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('selectReroll')
					.setLabel('Select Reroll')
					.setStyle('SECONDARY'),
			);
		await interaction.reply({ content: 'Content', components: [row] });
	},
	async button(interaction) {

	}
};