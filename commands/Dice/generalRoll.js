const Discord = require('discord.js');
const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const GeneralRoll = require('../../modules/dice/GeneralRoll.js');

module.exports = {
    name: 'Dice: General Roll',
    aliases: ['roll', 'r'],
    description: 'Roll as many X sided dice you can think of',
    usage: `${prefix}roll dice {+/- dice} {+/- modifier} {@ difficulty} {reason}`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }
        
        let generalRoll = new GeneralRoll(message);
        if (content.match(
            /(\d+d\d+)(\s*(\+|-|\*|\/)\s*((\d+d\d+)|(\d+)))*(\s*@\s*\d+)?/i))
        {
            generalRoll.parseContent(content);
        }
        else 
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        }        

        generalRoll.roll();

        let embed = generalRoll.contructEmbed();
        
        message.channel.send(embed);
        if (!generalRoll.error) message.delete().catch(error => 
        {
            if (error instanceof Discord.DiscordAPIError && 
                (error.code != 50003 && error.code != 50013)) 
            {
                // Error codes Missing permissings || In a DM channel
                console.log(error)
                throw error;
            }
        });
    }
}

function getHelpMessage()
{
    return 'Dice: 2d6 Where 2 is the number of dice to roll. ' +
        'And 6 is the number of sides' +
        '\nModifier: A number that is be added or subtracted to the total' +
        ' result' +
        '\nDifficutly: A number that the total will need to be higher then to' +
        ' pass the roll' +
        '\nReason: A simple note for why you are rolling' +
        '\nNotes: You can add as many Dice and Modifiers as you like' +
        ' in any order after adding the first dice.' +
        ' The Difficulty must always be at the end.' +
        `\nExamples:\n${prefix}roll 2d10 + 5 + 4d6 - 2 @ 10 testing` +
        `\n${prefix}roll 6d5 + 4 @ 3`;
}