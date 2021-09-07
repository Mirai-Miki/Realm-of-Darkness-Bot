'use strict';

const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const Tracker = require('../../modules/Tracker/Tracker.js');
const mode = require('../../modules/Tracker/TypeDef/mode.js');

module.exports = {
    name: 'Tracker: New Character',
    aliases: ['new', 'n'],
    description: 'Creates a new character to be tracked',
    usage: `${prefix}new <name> <keys> {Reason}`,
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
            /^\s*\w+\s+\w+\s*=\s*(\+|-)?\s*\w+/i))
        {
            tracker.setMode(mode.new);
            tracker.parseCharacter(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        } 

        let retMess = tracker.newCharacter();
        
        message.channel.send(retMess);
    }
}

function getHelpMessage()
{
    return 'Name: The name of the new Character' +
        '\nKeys: A number of keys in for form of "Key=Value" where key' +
        'is the key of the value being selected and value is the ' +
        'returned value.' +
        '\nReason: An Optional note that will be added to the returned' +
        ' message\nNotes: For more information of Keys please use the' +
        ` ${prefix}Keys command` +
        '\nRequired Keys: the "version" and "splat" keys.' +
        `\nExamples:\n${prefix}new Name version=v5 splat=vampire willpower=6` +
        `health=7 Humanity=8\n${prefix}n Name version=v20 splat=vampire ` +
        'blood=15 path=4 willpower=8';
}