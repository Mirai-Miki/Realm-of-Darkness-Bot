'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Dice rolls for the v5 Game.')
    .addSubcommand(subcommand => subcommand
        .setName('find')
        .setDescription('Finds all of your character or just a specific one.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("Name of the character to find."))
    )
    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Deletes one of your Characters')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("Name of the character to delte"))      
    ),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};