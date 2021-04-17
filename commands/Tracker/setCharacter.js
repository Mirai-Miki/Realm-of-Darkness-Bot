const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const Tracker = require('../../modules/Tracker/Tracker.js');
const mode = require('../../modules/Tracker/TypeDef/mode.js');

module.exports = {
    name: 'Tracker: Set Consumables',
    aliases: ['set', 's'],
    description: 'Updates a characters consumable max values. Any' +
        ' Field marked as "Consumable" will need the Set command to ' +
        'edit the max values.',
    usage: `${prefix}set <name> <keys> {Reason}`,
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
            tracker.setMode(mode.set);
            tracker.parseCharacter(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        } 

        let retMess = tracker.existingCharacter();
        
        message.channel.send(retMess.embed);
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
    `\nExamples:\n${prefix}set Name willpower=8 setting willpower to 8` +
    `\n${prefix}s Name experiance=15 setting total experiance to 15`;
}