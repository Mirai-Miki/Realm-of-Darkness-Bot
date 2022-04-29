'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: human20thCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function human20thCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('human')
	    .setDescription('x');

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('new')
        .setDescription('Create a new Human 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. VtM 20th Corebook p120")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true))        
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Your total Humanity" +
                "Must be between 0 and 10. VtM 20th Corebook p309")
            .setMinValue(0)
            .setMaxValue(10)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Your current Blood Pool. " +
                "Must be between 1 and 10. VtM 20th Corebook p121")
            .setMinValue(1)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "VtM 20th Corebook p122")
            .setMinValue(0)
            .setMaxValue(1000))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. Defaults to 7. " +
                "Must be between 7 and 15. VtM 20th Corebook p282")
            .setMinValue(7)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
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
        .setDescription('Set values for your Human 20th')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Sets you total Willpower to the number. " +
                "Must be between 1 and 10. VtM 20th Corebook p120")
            .setMinValue(1)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Sets your Mortality to the number. " +
                "Must be between 0 and 10. VtM 20th Corebook p309")
            .setMinValue(0)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Sets you current Blood Pool to the number. " +
                "Must be between 1 and 10. VtM 20th Corebook p121")
            .setMinValue(1)
            .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Sets your total Exp to the number. " +
                "Positive value will update current exp as well." +
                " V20 Core p122")
            .setMinValue(0)
            .setMaxValue(1000))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Sets your Health to the number. " +
                "Must be between 7 and 15. VtM 20th Corebook p282")
            .setMinValue(7)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "VtM 20th Corebook p285")
            .setMinValue(0)
            .setMaxValue(15))
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
	    .setDescription('Update values for your Human 20th')
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
            option.setName("morality")
            .setDescription("Updates your Morality by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p309")
            .setMinValue(-20)
            .setMaxValue(20))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Updates you Blood Pool by the amount. " +
                "Must be between -20 and 20. VtM 20th Corebook p121")
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
    );        
    return slashCommand;
}