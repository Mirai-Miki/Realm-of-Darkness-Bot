'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const WoD20thRoll = require('../../modules/dice/20th/WoD20thRoll.js');
const WoD20thInit = require('../../modules/dice/20th/WoD20thInit.js');

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
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))
                .addBooleanOption(option =>
                    option.setName("cancel_ones")
                        .setDescription("Stops any 1s from removing successes" +
                            " from the result."))
        )
        .addSubcommand(subcommand =>        
            subcommand
                .setName('initiative')
                .setDescription('Initiative roll using Dex + Wits p271')
                .addIntegerOption(option =>
                    option.setName("dexterity_wits")
                    .setDescription("Your Dexterity plus you Wits." +
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
                const roll = new WoD20thRoll(interaction);
                if (roll.isArgsValid())
                {
                    roll.roll();
                    roll.constructEmbed();
                    roll.constructContent();
                    roll.reply();
                }
                break;
            case 'initiative':
                const init = new WoD20thInit(interaction);
                if (init.isArgsValid())
                {
                    init.roll();
                    init.constructEmbed();
                    init.reply();
                }
                break;
            case 'general':
                interaction.reply("TODO: add general roll.")
                break;
        }
	},
};