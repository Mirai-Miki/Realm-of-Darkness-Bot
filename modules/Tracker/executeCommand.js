'use strict';
const handleError = require("./util/handleError");
const { Collection } = require("discord.js");
const DatabaseAPI = require("../util/DatabaseAPI");
const fs = require("fs");
const handlersPath = './modules/Tracker/handlers/';

const handlers = new Collection();
const handlerFolders = fs.readdirSync(handlersPath);
for (const folder of handlerFolders) {
    const handlerFiles = fs.readdirSync(
        `${handlersPath}${folder}`).filter(file => file.endsWith('.js'));
    for (const file of handlerFiles) {
        const handler = require(`./handlers/${folder}/${file}`);
        handlers.set(handler.getCommand(), handler);
    }
}

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

    const Handler = handlers.get(commandName);
    if (!Handler) return console.error(`No Handler for ${commandName}`);

    const handler = new Handler(interaction);

    if ((mode == 'new' || mode == 'set') &&
        handler.isSetArgsValid())
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
    else if (mode == 'update' && handler.isUpdateArgsValid() && 
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