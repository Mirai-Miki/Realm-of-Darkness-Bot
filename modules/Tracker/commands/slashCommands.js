'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const Find = require('./FindCharacter');
const TrackerChannel = require('./TrackerChannel');
const DeleteCharacters = require('./DeleteCharacters');
const StorytellerPermissions = 
    require('./StorytellerPermissions');

module.exports.trackerSlashCommands = () =>
{
    return new SlashCommandBuilder()
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
        )
        .addSubcommand(subcommand => subcommand
            .setName('channel')
            .setDescription('Selects a channel for copies of all tracking posts' +
                ' to be sent to. [ST only]')
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("The channel to be selected. Or removes a channel" +
                    " if already selected.")
                .setRequired(true))  
        )
        .addSubcommand(subcommand => subcommand
            .setName('storytellers')
            .setDescription('Sets the ST permissions for the ST only commands' +
                '. [Admin only]')
            .addRoleOption(option =>
                option.setName("role")
                .setDescription("The ST role to be added or removed."))  
        )
}

module.exports.trackerExecute = async (interaction) =>
{
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
        case 'channel':
            const trackerChannel = new TrackerChannel(interaction);
            trackerChannel.setChannel();
            break;
        case 'storytellers':
            new StorytellerPermissions(interaction);
            break;
    }
}