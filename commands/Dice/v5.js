'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('5th')
		.setDescription('Dice rolls for the 5th Edition Game.')
		.addSubcommand(subcommand =>
            subcommand
				.setName('roll')
				.setDescription('Standard roll p117')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll up to 3 regular dice using Willpower p122')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('resonance')
                .setDescription('Resonance roll p228')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('general')
                .setDescription('Roll a number of X-sided dice.')
        ),
	
	async execute(interaction) {
		console.log(interaction)
		await interaction.reply('Pong!');
	},
};