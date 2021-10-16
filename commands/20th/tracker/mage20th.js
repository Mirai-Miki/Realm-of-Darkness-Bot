'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');
const { Splats } = require('../../../modules/util/Constants')

module.exports = {
	data: mage20thCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function mage20thCommands()
{
	const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('mage')
	    .setDescription('Create a new World of Darkness Character ' +
            'to be tracked.');

    slashCommand.addSubcommand(subcommand => subcommand
        .setName('new')
        .setDescription("You're a wizard Harry")
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Your total Willpower. " +
                "Must be between 1 and 10. MtA 20th Corebook p330")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("arete")
            .setDescription("Your total Arete. " +
                "Must be between 0 and 10. MtA 20th Corebook p328")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("quintessence")
            .setDescription("Your total Quintessence. " +
                "Must be between 0 and 20. MtA 20th Corebook p331")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("paradox")
            .setDescription("Your total Paradox. " +
                "Must be between 0 and 20. MtA 20th Corebook p331")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Your total Experiance. " +
                "MtA 20th Corebook p335"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Your total Health. Defaults to 7. " +
                "Must be between 7 and 15. MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "MtA 20th Corebook p407"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "MtA 20th Corebook p407"))
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
        .setDescription('Fireball!!')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Sets you total Willpower to the number. " +
                "Must be between 1 and 10. MtA 20th Corebook p330"))
        .addIntegerOption(option =>
            option.setName("arete")
            .setDescription("Sets you Arete to the number. " +
                "Must be between 1 and 10. MtA 20th Corebook p328"))
        .addIntegerOption(option =>
            option.setName("quintessence")
            .setDescription("Sets your Quintessence to the number. " +
                "Must be between 0 and 10. MtA 20th Corebook p331"))
        .addIntegerOption(option =>
            option.setName("paradox")
            .setDescription("Sets your Parasox to the number. " +
                "Must be between 0 and 10. MtA 20th Corebook p331"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Sets your total Exp to the number. " +
                "+ values will update current exp as well." +
                " MtA 20th Corebook p335"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Sets your Health to the number. " +
                "Must be between 7 and 15. MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "MtA 20th Corebook p407"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "MtA 20th Corebook p407"))
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
        .setDescription('Who need armour when you have magick.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Willpower by the amount. " +
                "Must be between -15 and 15. MtA 20th Corebook p330"))
        .addIntegerOption(option =>
            option.setName("arete")
            .setDescription("Updates you Arete by the amount. " +
                "Must be between -20 and 20. MtA 20th Corebook p328"))
        .addIntegerOption(option =>
            option.setName("quintessence")
            .setDescription("Updates your Quintessence by the amount. " +
                "Must be between -30 and 30. MtA 20th Corebook p331"))
        .addIntegerOption(option =>
            option.setName("paradox")
            .setDescription("Updates your Paradox by the amount. " +
                "Must be between -30 and 30. MtA 20th Corebook p331"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. MtA 20th Corebook p335"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "MtA 20th Corebook p406"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "MtA 20th Corebook p407"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "MtA 20th Corebook p407"))
        .addStringOption(option =>
            option.setName("notes")
            .setDescription("Any aditional information you" +
                " would like to include."))
        
    );
    return slashCommand;
}