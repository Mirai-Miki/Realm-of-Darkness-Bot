'use strict';
const handleError = require("./util/handleError");
const isArgsValid = require('./util/isArgsValid');
const Handler = require('./HandleCharacter');
const { SplatVersions } = require('../util/Constants');
const DatabaseAPI = require('../util/DatabaseAPI')

module.exports = async function (interaction) { 
    let mode = '';
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

    const version = SplatVersions[commandName];
    const handler = new Handler(interaction, commandName, version);

    if ((mode == 'new' || mode == 'set') &&
        isArgsValid.set(handler.args, interaction, version))
    {
        if (mode == 'new' && handler.newCharacter())
        {
            await saveCharacter(handler);
        }
        else if (mode == 'set' && await handler.setCharacter())
        {
            await saveCharacter(handler);
        }
    }
    else if (mode == 'update' && 
        isArgsValid.update(handler.args, interaction) && 
        await handler.updateCharacter())
    {
        await saveCharacter(handler);
    }    
}

async function saveCharacter(handler)
{
    const result = await DatabaseAPI.saveCharacter(handler.character)
    if (result === 'saved')
    {
        handler.constructEmbed();
        await handler.reply();
    }
    else if (result === 'exists') handleError(handler.interaction, 'exists');
    else handleError(handler.interaction, 'dbError');
}