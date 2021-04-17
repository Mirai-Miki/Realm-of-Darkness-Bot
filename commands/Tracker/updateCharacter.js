const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const Tracker = require('../../modules/Tracker/Tracker.js');
const mode = require('../../modules/Tracker/TypeDef/mode.js');

module.exports = {
    name: 'Tracker: Update Character',
    aliases: ['update', 'u'],
    description: 'Updates a characters existing values. Any' +
        ' Value marked as "Consumable" will need the Set command to ' +
        'Edit the max values.',
    usage: `${prefix}update <name> <keys> {Reason}`,
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
            tracker.setMode(mode.update);
            tracker.parseCharacter(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        } 

        let retMess = tracker.existingCharacter();
        
        message.reply(retMess.embed);
    }
}

function getHelpMessage()
{
    return 'Name: The name of the existing Character' +
    '\nKeys: A number of keys in for form of "Key=Value" where key' +
    'is the key of the value being selected and value is the ' +
    'returned value.' +
    '\nReason: An Optional note that will be added to the returned' +
    ' message\nNotes: For more information of Keys please use the' +
    ` ${prefix}Keys command` +
    `\nExamples:\n${prefix}update Name hunger=-2 slacked 2 hunger` +
    `\n${prefix}u Name superficialWillpower=4 hunger=2 Took 4 willpower` +
    ' damage and hunger went up by 2';
}