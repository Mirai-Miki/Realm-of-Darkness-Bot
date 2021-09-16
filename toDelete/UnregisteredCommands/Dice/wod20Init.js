'use strict';

const Discord = require('discord.js');
const { prefix } = require('../../config.json');

const WoD20Init = require('../../modules/dice/WoD20Init.js');
const Help = require('../../modules/util/Help.js');

module.exports = {
    name: 'Dice: WoD v20 Inititive Roll',
    aliases: ['i', 'init', 'v20i', 'w20i'],
    description: 'WoD 20th edition Inititive Roll',
    usage: `${prefix}i modifier`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let wod20Init = new WoD20Init(message);
        if (content.match(/\d+/i))
        {
            wod20Init.parseContent(content);
        }
        else
        {
            return message.channel.send(`Usage: ${this.usage}` +
                `\ntype \`${prefix}${this.aliases[0]} help\` for more info`);
        }

        wod20Init.roll();

        let embed = wod20Init.constructEmbed();
        
        message.channel.send(embed);        
        if (!wod20Init.error) message.delete().catch(error => 
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
    return 'Modifier: A number that equals your Dexterity + Wits' +
        '\nNotes: see page 271 of VtM v20 corebook for more info' +
        `\nExamples: \n${prefix}i 5 You can add notes if you like`;
}