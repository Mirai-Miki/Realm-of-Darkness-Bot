'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: vampire20thUpdateCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function vampire20thUpdateCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('vampire' + '_update')
	    .setDescription('Update values for your Vampire 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Willpower by the amount. " +
                "Must be between -15 and 15. VtM 20th Corebook p120")
            .setMinValue(-15)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Updates you Blood Pool by the amount. " +
                "Must be between -200 and 200. VtM 20th Corebook p121")
            .setMinValue(-200)
            .setMaxValue(200))
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Updates your Morality by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p309")
            .setMinValue(-20)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. VtM 20th Corebook p122")
            .setMinValue(-3000)
            .setMaxValue(3000))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p282")
            .setMinValue(-20)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "VtM 20th Corebook p285")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "VtM 20th Corebook p285")
            .setMinValue(-50)
            .setMaxValue(50))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "VtM 20th Corebook p285")
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
    return slashCommand;
}