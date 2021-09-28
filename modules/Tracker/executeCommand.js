'use strict';
const handleError = require("./util/handleError");
const { Collection } = require("discord.js");
const DatabaseAPI = require("../util/DatabaseAPI");
const fs = require("fs");
const handlersPath = './modules/Tracker/handlers/'

const dbError = 'There was an error accessing the Database. Please try again' +
    ' later.\nIf this issue persists please report it at the ' +
    '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).'

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
    
    const group = interaction.options.getSubcommandGroup(false);
    const subcommand = ((group ?? '') + interaction.options.getSubcommand());

    const Handler = handlers.get(subcommand);
    if (!Handler) return console.error(`No Handler for ${subcommand}`);

    const handler = new Handler(interaction);

    if ((interaction.commandName == 'new' || interaction.commandName == 'set') &&
        handler.isSetArgsValid())
    {
        if (interaction.commandName == 'new' && handler.newCharacter())
        {
            await saveCharacter(handler);
        }
        else if (interaction.commandName == 'set' && await handler.setCharacter())
        {
            await saveCharacter(handler);
        }
    }
    else if (interaction.commandName == 'update' && handler.isUpdateArgsValid() && 
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