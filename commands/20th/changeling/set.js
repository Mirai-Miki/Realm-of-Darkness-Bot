'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');
const { Splats } = require('../../../modules/util/Constants')

module.exports = {
	data: changeling20thSetCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function changeling20thSetCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('changeling' + '_set')
	    .setDescription('All the world is made of faith, and trust, and pixie dust.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Sets you total Willpower to the number. " +
                "Must be between 1 and 10. CtD 20th Corebook p258"))
        .addIntegerOption(option =>
            option.setName("glamour")
            .setDescription("Sets you total Glamour to the number. " +
                "Must be between 1 and 10. CtD 20th Corebook p259"))        
        .addIntegerOption(option =>
            option.setName("banality")
            .setDescription("Sets you total Banality to the number. " +
                "Must be between 1 and 10. CtD 20th Corebook p267"))
        .addIntegerOption(option =>
            option.setName("nightmare")
            .setDescription("Sets you Nightmare to the number. " +
                "Must be between 0 and 10. CtD 20th Corebook p274"))
        .addIntegerOption(option =>
            option.setName("imbalance")
            .setDescription("Sets you imbalance to the number. " +
                "Must be between 0 and 10. CtD 20th Corebook p275"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Sets your total Exp to the number. " +
                "+ values will update current exp as well." +
                " CtD 20th Corebook p175"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Sets your Health to the number. " +
                "Must be between 7 and 15. CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("health_chimerical")
            .setDescription("Your total Chimerical Health. Defaults to 7. " +
                "Must be between 7 and 15. CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("bashing_chimerical")
            .setDescription("The total Chimerical bashing damage inflicted. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("lethal_chimerical")
            .setDescription("The total Chimerical lethal damage inflicted. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("agg_chimerical")
            .setDescription("The total Chimerical Agg damage inflicted. " +
                "CtD 20th Corebook p290"))
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
    return slashCommand;                  
}