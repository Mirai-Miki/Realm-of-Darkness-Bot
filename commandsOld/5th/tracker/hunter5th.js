'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: hunter5thCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function hunter5thCommands()
{
	const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('hunter')
	    .setDescription('x');

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('new')
        .setDescription("Create a new v5 Hunter.")
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 20. HtR v5 Corebook p60")
            .setMaxValue(20)
            .setMinValue(1)
            .setRequired(true))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. " +
                "Must be between 1 and 20. HtR v5 Corebook p60")
            .setMaxValue(20)
            .setMinValue(1)
            .setRequired(true))     
        .addIntegerOption(option =>
            option.setName("desperation")
            .setDescription("Your current Desperation rating. " +
                "Must be between 1 and 5. HtR v5 Corebook p125")
            .setMaxValue(5)
            .setMinValue(1))
        .addIntegerOption(option =>
            option.setName("danger")
            .setDescription("Your current Danger rating. " +
                "Must be between 1 and 5. HtR v5 Corebook p125")
            .setMaxValue(5)
            .setMinValue(1))
        .addBooleanOption(option =>
            option.setName("despair")
            .setDescription("If you are currently in despair. HtR v5 Corebook p128"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "HtR v5 Corebook p82")
            .setMaxValue(1000)
            .setMinValue(0))        
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Your current Superficial Willpower Damage. " +
                "Must be between 0 and 15. HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Your current Aggravated Willpower Damage. " +
                "HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Your current Superficial Health Damage. " +
                "Must be between 0 and 20. HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Your current Aggravated Health Damage. " +
                "Must be between 0 and 20. HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
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
    );

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('set')
        .setDescription('Set values for your v5 Hunter.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 20. HtR v5 Corebook p60")
            .setMaxValue(20)
            .setMinValue(1))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. " +
                "Must be between 1 and 20. HtR v5 Corebook p60")
            .setMaxValue(20)
            .setMinValue(1))     
        .addIntegerOption(option =>
            option.setName("desperation")
            .setDescription("Your current Desperation rating. " +
                "Must be between 1 and 5. HtR v5 Corebook p125")
            .setMaxValue(5)
            .setMinValue(1))
        .addIntegerOption(option =>
            option.setName("danger")
            .setDescription("Your current Danger rating. " +
                "Must be between 1 and 5. HtR v5 Corebook p125")
            .setMaxValue(5)
            .setMinValue(1))
        .addBooleanOption(option =>
            option.setName("despair")
            .setDescription("If you are currently in despair. HtR v5 Corebook p128"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "+ values will also increase your current. HtR v5 Corebook p82")
            .setMaxValue(1000)
            .setMinValue(0))        
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Your current Superficial Willpower Damage. " +
                "Must be between 0 and 15. HtR v5 Corebook p123")
            .setMaxValue(15)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Your current Aggravated Willpower Damage. " +
                "HtR v5 Corebook p123")
            .setMaxValue(15)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Your current Superficial Health Damage. " +
                "Must be between 0 and 20. HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Your current Aggravated Health Damage. " +
                "Must be between 0 and 20. HtR v5 Corebook p123")
            .setMaxValue(20)
            .setMinValue(0))
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
                " Enter a colour hex code eg #6f82ab. " +
                "[Supporter Only]"))
        .addStringOption(option =>
            option.setName("image")
            .setDescription("Changes your Character's Thumbnail" +
            " Image. Must be a valid URL. [Supporter Only]"))                    
    );

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('update')
        .setDescription('Update values for your v5 Vampire.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))          
        .addIntegerOption(option =>
            option.setName("desperation")
            .setDescription("Upates your Desperation by the value. " +
                "Must be between -10 and 10. HtR v5 Corebook p125")
            .setMaxValue(10)
            .setMinValue(-10))
        .addIntegerOption(option =>
            option.setName("danger")
            .setDescription("Updates your Danger by the value. " +
                "Must be between -10 and 10. HtR v5 Corebook p125")
            .setMaxValue(10)
            .setMinValue(-10))
        .addBooleanOption(option =>
            option.setName("despair")
            .setDescription("If you are currently in despair. HtR v5 Corebook p128"))  
        .addIntegerOption(option =>
            option.setName("willpower_superficial")
            .setDescription("Updates you current SW damage" +
                " by the amount. Must be between -30 and 30. HtR v5 Corebook p123")
            .setMaxValue(30)
            .setMinValue(-30))
        .addIntegerOption(option =>
            option.setName("health_superficial")
            .setDescription("Updates you current SH Damage" +
            " by the amount. Must be between -30 and 30. HtR v5 Corebook p123")
            .setMaxValue(30)
            .setMinValue(-30))
        .addIntegerOption(option =>
            option.setName("willpower_agg")
            .setDescription("Updates you current AW Damage" +
            " by the amount. Must be between -30 and 30. HtR v5 Corebook p123")
            .setMaxValue(30)
            .setMinValue(-30))        
        .addIntegerOption(option =>
            option.setName("health_agg")
            .setDescription("Updates you current AH Damage" +
            " by the amount. Must be between -30 and 30. HtR v5 Corebook p123")
            .setMaxValue(30)
            .setMinValue(-30))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates you Current Exp by the amount." +
                "+ values will also increase your total. VtM v5 Corebook p130")
            .setMaxValue(2000)
            .setMinValue(-2000))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Total Willpower by the amount. " +
                "Must be between -20 and 20. VtM v5 Corebook p157")
            .setMaxValue(20)
            .setMinValue(-20))   
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Total Health by the amount. " +
                "Must be between -30 and 30. VtM v5 Corebook p126")
            .setMaxValue(30)
            .setMinValue(-30)) 
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