'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const execute = require('../../../modules/Tracker/executeCommand.js');

module.exports = {
	data: vampire20thNewCommands(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};

function vampire20thNewCommands()
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('vampire' + '_new')
        .setDescription('Create a new Vampire 20th')
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
            option.setName("blood")
            .setDescription("Your total Blood Pool. " +
                "Must be between 1 and 100. VtM 20th Corebook p121")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("morality")
            .setDescription("Your total Humanity or Path. " +
                "Must be between 0 and 10. VtM 20th Corebook p309")
            .setMinValue(0)
            .setMaxValue(10)
            .setRequired(true))
        .addStringOption(option =>
            option.setName("morality_name")
            .setDescription("The name of your chosen Morality. " +
                "Default to 'Humanity'. VtM 20th Corebook p309")
                .addChoices(
                    {name: 'Humanity', value: 'Humanity'},
			        {name: 'Path of Asakku', value: 'Path of Asakku'},
			        {name: 'Path of Blood', value: 'Path of Blood'},
                    {name: 'Path of the Bones', value: 'Path of the Bones'},
			        {name: 'Path of Caine', value: 'Path of Caine'},
			        {name: 'Path of Cathari', value: 'Path of Cathari'},
                    {name: 'Path of Death and the Soul', value: 'Path of Death and the Soul'},
			        {name: 'Path of Ecstasy', value: 'Path of Ecstasy'},                
			        {name: 'Path of Entelechy', value: 'Path of Entelechy'},
			        {name: 'Path of Evil Revelations', value: 'Path of Evil Revelations'},
                    {name: 'Path of the Feral Heart', value: 'Path of the Feral Heart'},
			        {name: 'Path of Harmony', value: 'Path of Harmony'},
			        {name: 'Path of the Hive', value: 'Path of the Hive'},
                    {name: 'Path of Honorable Accord', value: 'Path of Honorable Accord'},
			        {name: 'Path of Lilith', value: 'Path of Lilith'},
			        {name: 'Path of Metamorphosis', value: 'Path of Metamorphosis'},
                    {name: 'Path of Night', value: 'Path of Night'},
			        {name: 'Path of Paradox', value: 'Path of Paradox'},
			        {name: 'Path of Power and the Inner Voice', value: 'Path of Power and the Inner Voice'},
                    {name: 'Path of the Scorched Heart', value: 'Path of the Scorched Heart'},
			        {name: 'Path of Self-Focus', value: 'Path of Self-Focus'},
			        {name: 'Path of Typhon', value: 'Path of Typhon'},
                    {name: 'Path of the Warrior', value: 'Path of the Warrior'}
                ))
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
    return slashCommand;
}