'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');

const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
//const generalRoll = require('./generalRoll.js');
//const wod20Init = require('./wod20Init.js');
const WoD20Roll = require('../../modules/dice/WoD20Roll.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('20th')
		.setDescription('Dice rolls for the 20th Anniversary Edition Game.')
		.addSubcommand(subcommand =>        
            subcommand
				.setName('roll')
				.setDescription('Standard roll p246')
                .addIntegerOption(option =>
                    option.setName("pool")
                    .setDescription("The Number of dice to roll. " +
                        "Must be between 1 and 50. p247")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("difficulty")
                    .setDescription("The Difficulty of the roll." +
                        " Must be between 2 to 10. p249")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("modifier")
                    .setDescription("The number of automatic successes. p250"))
                .addStringOption(option =>
                    option.setName("speciality")
                    .setDescription("The speciality applied to the roll. p96"))
                .addStringOption(option =>
                    option.setName("reason")
                    .setDescription("The reason for the roll and pool used."))
        )
        .addSubcommand(subcommand =>        
            subcommand
                .setName('initiative')
                .setDescription('Initiative roll using Dex + Wits p271')
                .addIntegerOption(option =>
                    option.setName("dexterity")
                    .setDescription("Your Dexterity." +
                        " Must be between 1 and 50")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("wits")
                    .setDescription("Your Wits." +
                        " Must be between 1 and 50")
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('general')
                .setDescription('Roll a number of X-sided dice.')
        ),
	
	async execute(interaction) {
        switch (interaction.options.getSubcommand())
        {
            case 'roll':
                interaction.reply("roll")
                break;
            case 'initiative':
                interaction.reply("Init")
                break;
            case 'general':
                interaction.reply("General")
                console.log(interaction)
                break;
        }
	},
};