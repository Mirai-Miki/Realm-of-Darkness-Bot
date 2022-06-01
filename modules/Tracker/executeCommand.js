'use strict';
const handleError = require("./util/handleError");
const { isSetArgsValid, isUpdateArgsValid } = require('./util/isArgsValid');
const Handler = require('./HandleCharacter');
const { clientVersions } = require('../util/Constants');
const DatabaseAPI = require('../../databaseAPI/DatabaseAPI.js')

module.exports = async function (interaction) { 
    let mode = '';
    await interaction.deferReply({ ephemeral: true });
    const subcommand = interaction.options.getSubcommand(false);
    let commandName = interaction.commandName;

    if (commandName.includes('new') || subcommand?.includes('new'))
        mode = 'new';
    else if (commandName.includes('set') || subcommand?.includes('set'))
        mode = 'set';
    else mode = 'update';

    if (!subcommand)
    {
        // Need to strip excess
        commandName = commandName.replace(/(_new)|(_update)|(_set)/i, '')
    }
    
    const version = clientVersions[interaction.client.user.id];
    const handler = new Handler(interaction, commandName, version);

    if ((mode == 'new' || mode == 'set') &&
        await isSetArgsValid(handler.args, interaction, version))
    {
        if (mode == 'new' && await handler.newCharacter())
        {
            await saveCharacter(handler);
        }
        else if (mode == 'set' && await handler.setCharacter())
        {
            await saveCharacter(handler);
        }
    }
    else if (mode == 'update' && 
        await isUpdateArgsValid(handler.args, interaction) && 
        await handler.updateCharacter())
    {
        await saveCharacter(handler);
    }
    await handler.cleanup();
}

async function saveCharacter(handler)
{
    const result = await DatabaseAPI.saveCharacter(handler.character)
    if (result === 'saved')
    {
        handler.constructEmbed();
        await handler.reply();
    }
    else if (result === 'exists') 
        await handleError(handler.interaction, 'exists');
    else if (result === 'charOverflow') 
        await handleError(handler.interaction, 'charOverflow');
    else 
        await handleError(handler.interaction, 'dbError');
}