'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const Find = require('../../modules/Tracker/FindCharacter')
const DeleteCharacters = require('../../modules/Tracker/DeleteCharacters')

module.exports = {
	data: new SlashCommandBuilder()
    .setName('tracker')
    .setDescription('Tracker Commands')
    .addSubcommand(subcommand => subcommand
        .setName('find')
        .setDescription('Finds one or a specific Character')
        .addUserOption(option =>
            option.setName("player")
            .setDescription("The player the character belongs to. [ST Only]"))
    )
    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Choose which Character you wish to Delete.')      
    ),      
	
	async execute(interaction) {
        switch (interaction.options.getSubcommand())
        {
            case 'find':
                const find = new Find(interaction);
                const char_list = await find.get_name_list();
                if (char_list)
                {
                    find.constructResponse();
                    find.constructComponents();
                    await find.reply();
                }
                break;
            case 'delete':
                const deleteChars = new DeleteCharacters(interaction);
                const chars = await deleteChars.getNameList()
                if (chars)
                {
                    deleteChars.constructComponents();
                    await deleteChars.reply();
                }
                break;
        }
	}
};