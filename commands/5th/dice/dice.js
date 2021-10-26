'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const Resonance = require('../../../modules/dice/5th/Resonance.js');
const GeneralRoll = require('../../../modules/dice/GeneralRoll');
const Rouse = require('../../../modules/dice/5th/Rouse.js');
const WoD5thRoll = require('../../../modules/dice/5th/WoD5thRoll.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Dice rolls for the v5 Game.')
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
                .addStringOption(option =>
                    option.setName("rouse")
                    .setDescription("Select if you would also like to Rouse" +
                    " the blood. p211")
                    .addChoice('No Reroll', 'No Reroll')
                    .addChoice('Reroll', 'Reroll'))
                .addStringOption(option =>
                    option.setName("character")
                    .setDescription("Name of the character making the roll."))
                .addBooleanOption(option =>
                    option.setName("auto_hunger")
                    .setDescription("Select if you would like you hunger" +
                        " to be taken from your character."))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rouse')
                .setDescription('Rouse the blood for special feats. p211')
                .addBooleanOption(option =>
                    option.setName("reroll")
                    .setDescription("Select if you are able to roll 2 dice. p211"))
                .addStringOption(option =>
                    option.setName("character")
                    .setDescription("Name of the character making the roll."))
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
                .addStringOption(option =>
                    option.setName("dice_set_01")
                    .setDescription('A dice set is defined as "(x)d(y)"' +
                        ' where (x) is the number of dice and (y) is the' +
                        ' number of sides.')
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName("dice_set_02")
                    .setDescription('A dice set is defined as "(x)d(y)"' +
                        ' where (x) is the number of dice and (y) is the' +
                        ' number of sides.'))
                .addStringOption(option =>
                    option.setName("dice_set_03")
                    .setDescription('A dice set is defined as "(x)d(y)"' +
                        ' where (x) is the number of dice and (y) is the' +
                        ' number of sides.'))
                .addStringOption(option =>
                    option.setName("dice_set_04")
                    .setDescription('A dice set is defined as "(x)d(y)"' +
                        ' where (x) is the number of dice and (y) is the' +
                        ' number of sides.'))
                .addStringOption(option =>
                    option.setName("dice_set_05")
                    .setDescription('A dice set is defined as "(x)d(y)"' +
                        ' where (x) is the number of dice and (y) is the' +
                        ' number of sides.'))
                .addIntegerOption(option =>
                    option.setName("difficulty")
                    .setDescription('The total needed to pass the Roll.'))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription('Any additional information you would' +
                        ' like to include.'))
        ),
	
	async execute(interaction) {
		switch (interaction.options.getSubcommand())
        {
            case 'roll':
                const roll = new WoD5thRoll(interaction);
                if (await roll.isArgsValid())
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
                if (await rouseRoll.isArgsValid())
                {
                    rouseRoll.roll();
                    rouseRoll.constructEmbed();
                    await rouseRoll.reply();
                }                
                break;
            case 'general':
                const generalRoll = new GeneralRoll(interaction);
                if (generalRoll.isArgsValid())
                {
                    generalRoll.roll();
                    generalRoll.contructEmbed();
                    generalRoll.reply();
                }
                break;
        }
	}
};

