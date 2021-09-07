'use strict';

const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const Tracker = require('../../modules/Tracker/Tracker.js');
const mode = require('../../modules/Tracker/TypeDef/mode.js');

module.exports = {
    name: 'Tracker: Delete Character',
    aliases: ['delete'],
    description: 'Deletes a character from the Database.',
    usage: `${prefix}delete <name>`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }
        
        let tracker = new Tracker(message);
        if (content.match(
            /^\s*\w+/i))
        {
            tracker.setMode(mode.delete);
            tracker.parseCharacter(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        } 

        let retMess = tracker.deleteCharacter();
        
        message.channel.send(retMess);
    }
}

function getHelpMessage()
{
    return 'Name: The name of the existing Character' +
    '\nNotes: Can only be done by either the Owner, ST or Admin' +
    `\nExamples:\n${prefix}delete Name`;
}