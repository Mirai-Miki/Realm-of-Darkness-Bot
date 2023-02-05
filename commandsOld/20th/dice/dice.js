'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const WoD20thRoll = require('../../../modules/dice/20th/WoD20thRoll.js');
const WoD20thInit = require('../../../modules/dice/20th/WoD20thInit.js');
const GeneralRoll = require('../../../modules/dice/GeneralRoll');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Dice rolls for the 20th Anniversary Edition Game.')
		.addSubcommand(subcommand =>        
            subcommand
				.setName('roll')
				.setDescription('Standard roll p246')
                .addIntegerOption(option =>
                    option.setName("pool")
                    .setDescription("The Number of dice to roll. " +
                        "Must be between 1 and 50. p247")
                    .setMaxValue(50)
                    .setMinValue(1)    
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("difficulty")
                    .setDescription("The Difficulty of the roll." +
                        " Must be between 2 to 10. p249")
                    .setMaxValue(10)
                    .setMinValue(2)
                    .setRequired(true))
                .addBooleanOption(option =>
                    option.setName("willpower")
                    .setDescription("Select to add 1 auto success. p250"))
                .addIntegerOption(option =>
                    option.setName("modifier")
                    .setDescription("The number of automatic successes. p250")
                    .setMaxValue(20)
                    .setMinValue(-20))
                .addStringOption(option =>
                    option.setName("speciality")
                    .setDescription("The speciality applied to the roll. p96"))
                .addStringOption(option =>
                    option.setName("notes")
                    .setDescription("Any extra information you would like to" +
                        " include."))
                .addIntegerOption(option =>
                    option.setName("nightmare")
                    .setDescription("Replaces x number of dice in your" +
                    " pool with Nightmare dice. p274")
                    .setMaxValue(50)
                    .setMinValue(1))
                .addStringOption(option =>
                    option.setName("character")
                    .setDescription("Name of the character making the roll."))
                .addBooleanOption(option =>
                    option.setName("no_botch")
                        .setDescription("Stops any 1s from removing successes" +
                            " from the result."))
        )
        .addSubcommand(subcommand =>        
            subcommand
                .setName('initiative')
                .setDescription('Initiative roll using Dex + Wits')
                .addIntegerOption(option =>
                    option.setName("dexterity_wits")
                    .setDescription("Your Dexterity plus you Wits." +
                        " Must be between 0 and 50")
                    .setMaxValue(50)
                    .setMinValue(0)
                    .setRequired(true))
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
                let roll = new WoD20thRoll(interaction);
                if (await roll.isArgsValid())
                {
                    await interaction.deferReply();
                    await roll.roll();
                    await roll.constructEmbed();
                    await roll.constructContent();
                    await roll.reply();
                }
                await roll.cleanup();
                roll = undefined;
                break;
            case 'initiative':
                let init = new WoD20thInit(interaction);
                if (await init.isArgsValid())
                {
                    await interaction.deferReply();
                    await init.roll();
                    await init.constructEmbed();
                    await init.reply();
                }
                await init.cleanup();
                init = undefined;
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
	},
};