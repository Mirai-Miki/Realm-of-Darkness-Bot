'use strict';
const { saveCharacter } = require('../util/util.js');
const { Collection } = require("discord.js");
const fs = require("fs");
const handlersPath = './modules/Tracker/handlers/'

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
            await reply(handler);
        }
        else if (interaction.commandName == 'set' && handler.setCharacter())
        {
            await reply(handler);
        }
    }
    else if (interaction.commandName == 'update' && handler.isUpdateArgsValid() && 
        handler.updateCharacter())
    {
        await reply(handler);
    }    
}

async function reply(handler)
{
    handler.constructEmbed();
    if (await handler.reply())
    {
        saveCharacter(handler.serialize());
    }
}