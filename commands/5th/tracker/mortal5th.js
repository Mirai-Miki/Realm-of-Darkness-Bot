'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');
const { Splats } = require('../../../modules/util/Constants')

module.exports = {
	data: mortal5thCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function mortal5thCommands()
{
	const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('mortal')
	    .setDescription('Create a new World of Darkness Character ' +
            'to be tracked.');

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('new')
        .setDescription("Create a new Mortal 5th Character.")
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. VtM v5 Corebook p157")
            .setRequired(true))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. " +
                "Must be between 1 and 15. VtM v5 Corebook p126")
            .setRequired(true))     
        .addIntegerOption(option =>
            option.setName("humanity")
            .setDescription("Your current Humanity. " +
                "Must be between 0 and 10. VtM v5 Corebook p236")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "VtM v5 Corebook p130"))        
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Your current Superficial Willpower Damage. " +
                "Must be between 0 and 10. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Your current Aggravated Willpower Damage. " +
                "VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Your current Superficial Health Damage. " +
                "Must be between 0 and 10. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Your current Aggravated Health Damage. " +
                "Must be between 0 and 15. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("stains")
            .setDescription("Your current Stains. " +
                "Must be between 0 and 10. VtM v5 Corebook p239"))
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
        .setDescription('Set values for your Mortal')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. VtM v5 Corebook p157"))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. " +
                "Must be between 1 and 15. VtM v5 Corebook p126"))     
        .addIntegerOption(option =>
            option.setName("humanity")
            .setDescription("Your current Humanity. " +
                "Must be between 0 and 10. VtM v5 Corebook p236"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "+ values will also increase your current. VtM v5 Corebook p130"))        
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Your current Superficial Willpower Damage. " +
                "Must be between 0 and 10. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Your current Aggravated Willpower Damage. " +
                "VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Your current Superficial Health Damage. " +
                "Must be between 0 and 10. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Your current Aggravated Health Damage. " +
                "Must be between 0 and 15. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("stains")
            .setDescription("Your current Stains. " +
                "Must be between 0 and 10. VtM v5 Corebook p239"))
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
        .setDescription('Update values for your Mortal.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Total Willpower by the amount. " +
                "Must be between -15 and 15. VtM v5 Corebook p157"))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Total Health by the amount. " +
                "Must be between -20 and 20. VtM v5 Corebook p126"))     
        .addIntegerOption(option =>
            option.setName("humanity")
            .setDescription("Updates your Humanity by the amount. " +
                "Must be between -15 and 15. VtM v5 Corebook p236"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates you Current Exp by the amount." +
                "+ values will also increase your total. VtM v5 Corebook p130"))        
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Updates you current SW Damage" +
                " by the amount. Must be between -15 and 15. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Updates you current AW Damage" +
            " by the amount. Must be between -15 and 15. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Updates you current SH Damage" +
            " by the amount. Must be between -20 and 20. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Updates you current AH Damage" +
            " by the amount. Must be between -15 and 15. VtM v5 Corebook p126"))
        .addIntegerOption(option =>
            option.setName("stains")
            .setDescription("Updates your Stains by the amount. " +
                "Must be between -15 and 15. VtM v5 Corebook p239"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        
    );
    return slashCommand;
}