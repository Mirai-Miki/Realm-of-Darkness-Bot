'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const Resonance = require('../../modules/dice/5th/Resonance.js');
const Rouse = require('../../modules/dice/5th/Rouse.js');
const WoD5thRoll = require('../../modules/dice/5th/WoD5thRoll.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('5th')
		.setDescription('Dice rolls for the 5th Edition Game.')
		.addSubcommand(subcommand =>
            subcommand
				.setName('roll')
				.setDescription('Standard roll. p117')
                .addIntegerOption(option =>
                    option.setName("pool")
                    .setDescription("The Number of dice to roll. " +
                        "Must be between 1 and 50. p118")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("hunger")
                    .setDescription("The number of hunger dice included in " +
                        "the pool. Must be between 0 to 5. Defaults to 0. p205"))
                .addIntegerOption(option =>
                    option.setName("difficulty")
                    .setDescription("The Difficulty is the number of dice " +
                        " 6+ needed. Must be between 1 and 50." +
                        " Defaults to 1. p119"))
                .addIntegerOption(option =>
                    option.setName("blood_surge")
                    .setDescription("Enter your current " +
                        " Blood Potency. Must be between 0 and 10. Also Rouses" +
                        " the blood. p218"))
                .addStringOption(option =>
                    option.setName("speciality")
                    .setDescription("The speciality applied to the roll. " +
                    " This adds one dice to your pool. p159"))
                .addBooleanOption(option =>
                    option.setName("rouse")
                    .setDescription("Select if you would also like to Rouse" +
                    " the blood. p211"))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rouse')
                .setDescription('Rouse the blood for special feats. p211')
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('resonance')
                .setDescription('Temperament and Resonance roll. p228')
                .addStringOption(option =>
                    option.setName("resonance")
                    .setDescription("Select if you already know the what" +
                        " the resonance will be.")
                    .addChoice('Phlegmatic', 'Phlegmatic')
                    .addChoice('Melancholy', 'Melancholy')
                    .addChoice('Choleric', 'Choleric')
                    .addChoice('Sanguine', 'Sanguine'))
                .addStringOption(option =>
                    option.setName("temperament")
                    .setDescription("Select if you already know the what" +
                        " the temperament will be.")
                    .addChoice('Fleeting', 'Fleeting')
                    .addChoice('Intense', 'Intense')
                    .addChoice('Acute', 'Acute'))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))

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
                const roll = new WoD5thRoll(interaction);
                if (roll.isArgsValid())
                {
                    roll.roll();
                    roll.constructEmbed();
                    roll.constructContent();
                    roll.constructInteractions();
                    await roll.reply();
                }
                break;
            case 'resonance':
                const resRoll = new Resonance(interaction);
                resRoll.roll();
                resRoll.constructEmbed();
                resRoll.reply();
                break;
            case 'rouse':
                const rouseRoll = new Rouse(interaction);
                rouseRoll.roll();
                rouseRoll.constructEmbed();
                rouseRoll.constructComponents();
                await rouseRoll.reply();
                break;
            case 'general':
                interaction.reply("TODO: add general roll.")
                break;
        }
	}
};

