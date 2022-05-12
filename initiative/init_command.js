const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('initiative')
		.setDescription('')
		.addSubcommand(subcommand =>        
            subcommand
				.setName('new')
				.setDescription('Creates a new Initiative tracker in this channel.')
        )
        .addSubcommand(subcommand =>        
            subcommand
				.setName('roll')
				.setDescription('Rolls initiative for a specific character.')
                .addStringOption(option =>
                    option.setName("name")
                    .setDescription("The name of the character rolling.")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("dex_wits")
                    .setDescription("Your Dexterity + Wits. " +
                        "Must be between 0 and 100.")
                    .setMaxValue(100)
                    .setMinValue(1)    
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("modifier")
                    .setDescription("Any bonus or penalties that apply. " +
                        "Must be between -50 and 50.")
                    .setMaxValue(50)
                    .setMinValue(-50))
        )
        .addSubcommand(subcommand =>        
            subcommand
				.setName('reroll')
				.setDescription('Rerolls the last roll for specific character.')
                .addStringOption(option =>
                    option.setName("name")
                    .setDescription("The name of the character rerolling.")
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>        
            subcommand
				.setName('declare')
				.setDescription('Declares the action for a specific character.')
                .addStringOption(option =>
                    option.setName("name")
                    .setDescription("The name of the character rerolling.")
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName("action")
                    .setDescription("The action you will take.")
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>        
            subcommand
				.setName('repost')
				.setDescription('Reposts a current tracker.')
        ),
    
    async execute(interaction) {
        switch (interaction.options.getSubcommand())
        {
            case 'new':
                break;
            case 'roll':
                break;
            case 'reroll':
                break;
            case 'declare':
                break;
            case 'repost':
                break;
        }
    },
}