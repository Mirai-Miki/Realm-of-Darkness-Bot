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
                    .setMaxValue(50)
                    .setMinValue(1)
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("hunger")
                    .setDescription("The number of hunger dice included in " +
                        "the pool. Must be between 0 to 5. Defaults to 0. p205")
                    .setMaxValue(5)
                    .setMinValue(0))
                .addIntegerOption(option =>
                    option.setName("difficulty")
                    .setDescription("The Difficulty is the number of dice " +
                        " 6+ needed. Must be between 1 and 50." +
                        " Defaults to 1. p119")
                    .setMaxValue(50)
                    .setMinValue(1))
                .addIntegerOption(option =>
                    option.setName("blood_surge")
                    .setDescription("Enter your current " +
                        " Blood Potency. Must be between 0 and 10. Also Rouses" +
                        " the blood. p218")
                    .setMaxValue(10)
                    .setMinValue(0))
                .addStringOption(option =>
                    option.setName("speciality")
                    .setDescription("The speciality applied to the roll. " +
                    " This adds one dice to your pool. p159"))
                .addStringOption(option =>
                    option.setName("rouse")
                    .setDescription("Select if you would also like to Rouse" +
                    " the blood. p211")
                    .setChoices(
                        {name: 'No Reroll', value: 'No Reroll'},
                        {name: 'Reroll', value: 'Reroll'}
                    ))
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
                    .addChoices(
                        {name: 'Phlegmatic', value: 'Phlegmatic'},
                        {name: 'Melancholy', value: 'Melancholy'},
                        {name: 'Choleric', value: 'Choleric'},
                        {name: 'Sanguine', value: 'Sanguine'}
                    ))
                .addStringOption(option =>
                    option.setName("temperament")
                    .setDescription("Select if you already know the what" +
                        " the temperament will be.")
                    .addChoices(
                        {name: 'Fleeting', value: 'Fleeting'},
                        {name: 'Intense', value: 'Intense'},
                        {name: 'Acute', value: 'Acute'}
                    ))
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
                .addIntegerOption(option =>
                    option.setName("modifier")
                    .setDescription('Adds or removes the number from the total.')
                    .setMaxValue(1000)
                    .setMinValue(-1000))
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
                    .setDescription('The total needed to pass the Roll.')
                    .setMaxValue(1000)
                    .setMinValue(1))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription('Any additional information you would' +
                        ' like to include.'))
        ),
	
	async execute(interaction) {
		switch (interaction.options.getSubcommand())
        {
            case 'roll':
                let roll = new WoD5thRoll(interaction);
                if (await roll.isArgsValid())
                {
                    await interaction.deferReply();
                    await roll.roll();
                    await roll.constructEmbed();
                    await roll.constructContent();
                    await roll.constructInteractions();
                    await roll.reply();
                }
                roll = undefined;
                break;
            case 'resonance':
                let resRoll = new Resonance(interaction);
                await interaction.deferReply();
                await resRoll.roll();
                await resRoll.constructEmbed();
                await resRoll.reply();
                await resRoll.cleanup();
                resRoll = undefined;
                break;
            case 'rouse':
                let rouseRoll = new Rouse(interaction);
                if (await rouseRoll.isArgsValid())
                {
                    await interaction.deferReply();
                    await rouseRoll.roll();
                    await rouseRoll.constructEmbed();
                    await rouseRoll.reply();
                } 
                await rouseRoll.cleanup();
                rouseRoll = undefined;          
                break;
            case 'general':
                let generalRoll = new GeneralRoll(interaction);
                if (await generalRoll.isArgsValid())
                {
                    await interaction.deferReply();
                    await generalRoll.roll();
                    await generalRoll.contructEmbed();
                    await generalRoll.reply();                    
                }
                await generalRoll.cleanup();
                generalRoll = undefined;
                break;
        }
	}
};

