'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: changeling20thNewCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function changeling20thNewCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('changeling' + '_new')
	    .setDescription('Create a new Changeling 20th.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. CtD 20th Corebook p258")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("glamour")
            .setDescription("Your total Glamour Pool. " +
                "Must be between 1 and 10. CtD 20th Corebook p259")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true))        
        .addIntegerOption(option =>
            option.setName("banality")
            .setDescription("Your total Banality Pool. " +
                "Must be between 1 and 10. CtD 20th Corebook p267")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("nightmare")
            .setDescription("Your total Nightmare. " +
                "Must be between 0 and 10. CtD 20th Corebook p274")
            .setMinValue(0)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("imbalance")
            .setDescription("Your total imbalance. " +
                "Must be between 0 and 10. CtD 20th Corebook p275")
            .setMinValue(0)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "CtD 20th Corebook p175")
            .setMinValue(0)
            .setMaxValue(1000))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. Defaults to 7. " +
                "Must be between 7 and 15. CtD 20th Corebook p290")
            .setMinValue(7)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("health_chimerical")
            .setDescription("Your total Chimerical Health. Defaults to 7. " +
                "Must be between 7 and 15. CtD 20th Corebook p290")
            .setMinValue(7)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("bashing_chimerical")
            .setDescription("The total Chimerical bashing damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("lethal_chimerical")
            .setDescription("The total Chimerical lethal damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("agg_chimerical")
            .setDescription("The total Chimerical Agg damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(0)
            .setMaxValue(15))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        .addStringOption(option =>
            option.setName("colour")
            .setDescription("Changes the side bar colour." +
                " Enter a colour hex code eg #6f82ab. " +
                "[Supporter Only]"))
        .addStringOption(option =>
            option.setName("image")
            .setDescription("Changes your Character's Thumbnail" +
            " Image. Must be a valid URL. [Supporter Only]"))
    return slashCommand;
}