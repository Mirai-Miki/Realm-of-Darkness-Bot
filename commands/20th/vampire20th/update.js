'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');
const { Splats } = require('../../../modules/util/Constants')

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
                "Must be between -15 and 15. VtM 20th Corebook p120"))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Updates you Blood Pool by the amount. " +
                "Must be between -200 and 200. VtM 20th Corebook p121"))
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Updates your Morality by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p309"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. VtM 20th Corebook p122"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p282"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "VtM 20th Corebook p285"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "VtM 20th Corebook p285"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "VtM 20th Corebook p285"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))        
    return slashCommand;
}