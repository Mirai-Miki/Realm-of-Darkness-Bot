'use strict';

const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const Tracker = require('../../modules/Tracker/Tracker.js');
const mode = require('../../modules/Tracker/TypeDef/mode.js');

module.exports = {
    name: 'Tracker: Find Character',
    aliases: ['find', 'f'],
    description: 'Finds a character from the Database.',
    usage: `${prefix}find <name> {--history}`,
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
            tracker.setMode(mode.find);
            tracker.parseCharacter(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        } 

        let retMess = tracker.find();
        
        // Sending history
        if (retMess.history) 
        {
            message.author.send(retMess.history, {split: {char: 'ﾠ'}})
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with your character and' +
                    ' history!');
            })
            .catch(error => {
                console.error(`Could not send History DM to ` +
                    `${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do ' +
                    'you have DMs disabled?');
            });
            message.author.send(retMess.embed)
            .catch(error => {}); // Throw second error into the void.
        }
        else
        {
            if (retMess.type) message.channel.send(retMess);
            else message.channel.send(retMess, {split: {char: 'ﾠ'}});
        }            
    }
}

function getHelpMessage()
{
    return 'Name: The name of the existing Character' +
    '. If name is all it will return all characters on the server.' +
    ' This only works for admins/mods however.' +
    '\n--History: adding the `--history` tag will DM the character as well' +
    ' as the last 10 commands made for that character' +
    '\nNotes: Can only be done by either the Owner, ST or Admin' +
    `\nExamples:\n${prefix}find Name`;
}