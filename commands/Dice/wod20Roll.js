'use strict';

const Discord = require('discord.js');
const { prefix } = require('../../config.json');

const Help = require('../../modules/util/Help.js');
const generalRoll = require('./generalRoll.js');
const wod20Init = require('./wod20Init.js');
const WoD20Roll = require('../../modules/dice/WoD20Roll.js');

module.exports = {
    name: 'Dice: WoD v20 Roll',
    aliases: ['v20', 'd', 'w20'],
    description: 'Rolls dice following the rules of WoD 20th edition',
    usage: `${prefix}v20 dice@diff {+/- modifier}{spec}{normalOnes} {reason}`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let wod20Roll = new WoD20Roll(message);
        if (content.match(
            /\d+\s*@\s*\d+(\s*(\+|-)\s*\d+)*(\s*(\+\s*)?(s|x)(\s*(\+\s*)?(?!\5)(s|x))?(\s+|$))?/i))
        {
            // WoD20Roll
            wod20Roll.parseContent(content);
        }
        else if (content.match(
            /(\d+d\d+)(\s*(\+|-|\*|\/)\s*((\d+d\d+)|(\d+)))*(\s*@\s*\d+)?/i))
        {
            // General Roll
            generalRoll.execute(message, args, content, prefix);
            return;
        }
        else if (content.match(/^\s*\d+(\s+|$)/i))
        {
            //init roll
            return wod20Init.execute(message, args, content);
        }
        else
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        }
        
        wod20Roll.roll();
        
        let embed = wod20Roll.constructEmbed();
        message.channel.send(embed);
        
        if (!wod20Roll.error) message.delete().catch(error => 
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
    return 'Dice: The amount of 10 sided dice in you pool' +
        '\nDiff: The difficulty of the roll. The minimum number the dice' +
        ' needs to land on to count as a success for the roll' +
        '\nModifier: a number that is added or subtracted to the final result' +
        '\nSpec: written as an "s" at the end of the roll.' +
        'It applies a specialty to that roll doubling any 10s that appear.' +
        '\nNormalOnes: written as an "x" at the end of the roll.' +
        'It stops dice that land on a 1 from removing successes, Treating' +
        ' them as just a normal fail.' +
        '\nReason: A short note on why you are rolling' +
        '\nNotes: See p246 of VtM v20 corebook for more info on rolling dice.' +
        `\nAdditional Commands: You can also use the general roll and ` +
        `WoD v20 Init roll from this command.` +
        `\nPermissions: If the bot has access to the "Manage Messages" ` +
        `permission in the channel it will delete the original message. ` +
        `IF you do not want this functionality just disable the permission ` +
        `for this channel.` +
        `\nExamples: ${prefix}v20 5@5+3s spec applied with a mod of 3` +
        `\n${prefix}v20 6@2s spec applied\n${prefix}d 7@8\n${prefix}d` +
        ` 4@6xs normal ones and spec applied`;
        
}