'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');
const { Splats } = require('../../../modules/util/Constants')

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
	    .setDescription('All the world is made of faith, and trust, and pixie dust.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Updates your Willpower Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p258"))
        .addIntegerOption(option =>
            option.setName("glamour")
            .setDescription("Updates your Glamour Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p259"))        
        .addIntegerOption(option =>
            option.setName("banality")
            .setDescription("Updates your Banality Pool by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p267"))
        .addIntegerOption(option =>
            option.setName("nightmare")
            .setDescription("Updates your Nightmare by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p274"))
        .addIntegerOption(option =>
            option.setName("imbalance")
            .setDescription("Updates your imbalance by the amount. " +
                "Must be between -15 and 15. CtD 20th Corebook p275"))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Updates your current exp. + values will increase" +
                " total as well. CtD 20th Corebook p175"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Updates your Health by the amount. " +
                "Must be between -20 and 20. CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("Updates your Bashing damage by the amount. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("Updates your Lethal damage by the amount. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("Updates your Agg damage by the amount. " +
                "CtD 20th Corebook p290"))
        .addIntegerOption(option =>
            option.setName("health_chimerical")
            .setDescription("Your total Chimerical Health. " +
                "Must be between -20 and 20. CtD 20th Corebook p290"))
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
    return slashCommand
}