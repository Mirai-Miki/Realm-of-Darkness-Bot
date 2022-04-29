'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: changeling20thUpdateCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function changeling20thUpdateCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('changeling' + '_update')
	    .setDescription('Update values for your Changeling 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Willpower Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p258")
            .setMinValue(-15)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("glamour")
            .setDescription("Updates your Glamour Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p259")
            .setMinValue(-15)
            .setMaxValue(15))        
        .addIntegerOption(option =>
            option.setName("banality")
            .setDescription("Updates your Banality Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p267")
            .setMinValue(-15)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("nightmare")
            .setDescription("Updates your Nightmare by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p274")
            .setMinValue(-15)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("imbalance")
            .setDescription("Updates your imbalance by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p275")
            .setMinValue(-15)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. CtD 20th Corebook p175")
            .setMinValue(-3000)
            .setMaxValue(3000))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. CtD 20th Corebook p290")
            .setMinValue(-20)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("health_chimerical")
            .setDescription("Your total Chimerical Health. " +
                "Must be between -20 and 20. CtD 20th Corebook p290")
            .setMinValue(-20)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName("bashing_chimerical")
            .setDescription("The total Chimerical bashing damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("lethal_chimerical")
            .setDescription("The total Chimerical lethal damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("agg_chimerical")
            .setDescription("The total Chimerical Agg damage inflicted. " +
                "CtD 20th Corebook p290")
            .setMinValue(-50)
            .setMaxValue(50))
        .addUserOption(option =>
            option.setName("player")
            .setDescription("The player the character belongs to. Used by STs" +
            " to update another players Char [ST Only]"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
    return slashCommand
}