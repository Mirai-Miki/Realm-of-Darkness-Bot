'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../modules/Tracker/executeCommand.js');

module.exports = {
	data: vampire20thSetCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function vampire20thSetCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('vampire20th_set')
        .setDescription('Not the sparkly kind.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("The name of your Character")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("willpower")
            .setDescription("Sets you total Willpower to the number. " +
                "Must be between 1 and 10. VtM 20th Corebook p120"))
        .addIntegerOption(option =>
            option.setName("blood")
            .setDescription("Sets you total Blood Pool to the number. " +
                "Must be between 1 and 100. VtM 20th Corebook p121"))
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Sets your Mortality to the number. " +
                "Must be between 0 and 10. VtM 20th Corebook p309"))
        .addStringOption(option =>
            option.setName("morality_name")
            .setDescription("Sets the name of your chosen Morality. " +
                "VtM 20th Corebook p309")
                .addChoice('Humanity', 'Humanity')
			    .addChoice('Path of Asakku', 'Path of Asakku')
			    .addChoice('Path of Blood', 'Path of Blood')
                .addChoice('Path of the Bones', 'Path of the Bones')
			    .addChoice('Path of Caine', 'Path of Caine')
			    .addChoice('Path of Cathari', 'Path of Cathari')
                .addChoice('Path of Death and the Soul', 'Path of Death and the Soul')
			    .addChoice('Path of Ecstasy', 'Path of Ecstasy')                
			    .addChoice('Path of Entelechy', 'Path of Entelechy')
			    .addChoice('Path of Evil Revelations', 'Path of Evil Revelations')
                .addChoice('Path of the Feral Heart', 'Path of the Feral Heart')
			    .addChoice('Path of Harmony', 'Path of Harmony')
			    .addChoice('Path of the Hive', 'Path of the Hive')
                .addChoice('Path of Honorable Accord', 'Path of Honorable Accord')
			    .addChoice('Path of Lilith', 'Path of Lilith')
			    .addChoice('Path of Metamorphosis', 'Path of Metamorphosis')
                .addChoice('Path of Night', 'Path of Night')
			    .addChoice('Path of Paradox', 'Path of Paradox')
			    .addChoice('Path of Power and the Inner Voice', 'Path of Power and the Inner Voice')
                .addChoice('Path of the Scorched Heart', 'Path of the Scorched Heart')
			    .addChoice('Path of Self-Focus', 'Path of Self-Focus')
			    .addChoice('Path of Typhon', 'Path of Typhon')
                .addChoice('Path of the Warrior', 'Path of the Warrior'))
        .addIntegerOption(option =>
            option.setName("exp")
            .setDescription("Sets your total Exp to the number. " +
                "Positive value will update current exp as well." +
                " V20 Core p122"))
        .addIntegerOption(option =>
            option.setName("health")
            .setDescription("Sets your Health to the number. " +
                "Must be between 7 and 15. VtM 20th Corebook p282"))
        .addIntegerOption(option =>
            option.setName("bashing_damage")
            .setDescription("The total bashing damage inflicted. " +
                "VtM 20th Corebook p285"))
        .addIntegerOption(option =>
            option.setName("lethal_damage")
            .setDescription("The total lethal damage inflicted. " +
                "VtM 20th Corebook p285"))
        .addIntegerOption(option =>
            option.setName("agg_damage")
            .setDescription("The total Agg damage inflicted. " +
                "VtM 20th Corebook p285"))
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