const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const WoD5Roll = require('../../modules/dice/WoD5Roll.js');
const generalRoll = require('./generalRoll.js');

module.exports = {
    name: 'WoD v5 Roll',
    aliases: ['v5', 'v'],
    description: 'Rolls dice following the rules of WoD 5th edition',
    usage: `${prefix}v5 pool {hunger} {difficulty} {reason}`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let roll = new WoD5Roll(message.client, message.author, message.member);
        if (content.match(
            /(\d+d\d+)(\s*(\+|-|\*|\/)\s*((\d+d\d+)|(\d+)))*(\s*@\s*\d+)?/i))
        {
            // General Roll
            generalRoll.execute(message, args, content, prefix);
            return;
        }
        else if (content.match(/\s*\d+(\s+\d+(\s+\d+)?)?/i))
        {
            // Standard roll
            roll.parseContent(content);
        }
        
        else
        {
            return message.channel.send(
                `Usage: ${this.usage}` +
                `\nType \`${prefix}v5 help\` for more info.`);
        }

        roll.roll();
        let response = roll.constructEmbed();
        if (response.message)
        message.channel.send(response.message, response.embed);
        else message.channel.send(response);

        if (!roll.error) message.delete().catch(error => 
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
    return 'Pool: The amount of 10 sided dice in you pool' +
        '\nHunger: The amount of hunger dice included in your pool' +
        '\nDifficulty: the number of dice that need to be 6 or over' +
        '\nReason: A short note on why you are rolling' +
        '\nNotes: See p117-p123 of VtM v5 corebook for more info on ' +
        'rolling dice.' +
        `\nAdditional Commands: You can also use the general roll ` +
        `from this command.` +
        `\nPermissions: If the bot has access to the "Manage Messages" ` +
        `permission in the channel it will delete the original message. ` +
        `IF you do not want this functionality just disable the permission ` +
        `for this channel.` +
        `\nExamples: ${prefix}v5 6 3 4 notes` +
        `\n${prefix}v 3 notes\n${prefix}v 7 2`;
}