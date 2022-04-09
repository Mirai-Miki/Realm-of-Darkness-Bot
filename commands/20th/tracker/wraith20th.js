'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: wraith20thCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function wraith20thCommands()
{
	const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('wraith')
	    .setDescription('x');

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('new')
        .setDescription("Create a new Wraith 20th")
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. WtO 20th Corebook p115")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("corpus")
            .setDescription("Your total Corpus. " +
                "Must be between 0 and 10. WtO 20th Corebook p291")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("pathos")
            .setDescription("Your Pathos rating. " +
                "Must be between 0 and 10. WtO 20th Corebook p114")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "WtO 20th Corebook p301"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. Defaults to 7. " +
                "Must be between 7 and 15. WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "WtO 20th Corebook p294"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "WtO 20th Corebook p294"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        .addStringOption(option =>
            option.setName("colour")
            .setDescription("Changes the side bar colour." +
                " Enter 3 space seperated RGB values. " +
                "[Supporter Only]"))
        .addStringOption(option =>
            option.setName("image")
            .setDescription("Changes your Character's Thumbnail" +
            " Image. Must be a valid URL. [Supporter Only]"))
    );

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('set')
        .setDescription('Set values for your Wraith 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Sets you total Willpower to the number. " +
                "Must be between 1 and 10. WtO 20th Corebook p115"))
        .addIntegerOption(option =>
            option.setName("corpus")
            .setDescription("Sets you Total Corpus to the number. " +
                "Must be between 1 and 10. WtO 20th Corebook p291"))
        .addIntegerOption(option =>
            option.setName("pathos")
            .setDescription("Sets your Pathos to the number. " +
                "Must be between 0 and 10. WtO 20th Corebook p114"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Sets your total Exp to the number. " +
                "+ values will update current exp as well." +
                " WtO 20th Corebook p301"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Sets your Health to the number. " +
                "Must be between 7 and 15. WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "WtO 20th Corebook p294"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "WtO 20th Corebook p294"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        .addStringOption(option =>
            option.setName("change_name")
            .setDescription("Change your Character's name."))
        .addStringOption(option =>
            option.setName("colour")
            .setDescription("Changes the side bar colour." +
                " Enter 3 space seperated RGB values. " +
                "[Supporter Only]"))
        .addStringOption(option =>
            option.setName("image")
            .setDescription("Changes your Character's Thumbnail" +
            " Image. Must be a valid URL. [Supporter Only]"))                    
    );

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('update')
        .setDescription('Update values for your Wraith 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Willpower by the amount. " +
                "Must be between -15 and 15. WtO 20th Corebook p115"))
        .addIntegerOption(option =>
            option.setName("corpus")
            .setDescription("Updates you current Corpus by the amount. " +
                "Must be between -20 and 20. WtO 20th Corebook p291"))
        .addIntegerOption(option =>
            option.setName("pathos")
            .setDescription("Updates your Pathos by the amount. " +
                "Must be between -20 and 20. WtO 20th Corebook p114"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. WtO 20th Corebook p301"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "WtO 20th Corebook p293"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "WtO 20th Corebook p294"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "WtO 20th Corebook p294"))
        .addUserOption(option =>
            option.setName("player")
            .setDescription("The player the character belongs to. Used by STs" +
            " to update another players Char [ST Only]"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        
    );
    return slashCommand;
}