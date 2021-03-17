const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const WoD5Roll = require('../../modules/dice/WoD5Roll.js');
const Discord = require('discord.js');

module.exports = {
    name: 'Dice: WoD v5 Reroll',
    aliases: ['reroll', 'rr', 'vr'],
    description: 'Rerolls a previously made roll following the rules ' +
        'of WoD 5th edition',
    usage: `${prefix}reroll <diceResult> {diceResult} {diceResult}\n` +
        `OR ${prefix}reroll on its own will do a quick reroll.`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let roll = new WoD5Roll(message.client, message.author, message.member);
        if (content.match(/^\s*\d+(\s+\d+(\s+\d+)?)?/i))
        {
            // Standard roll
            roll.parseReroll(content);
        }
        else if (content.match(/^\s*$/))
        {
            // quick reroll
            roll.quickReroll();
        }
        else
        {
            return message.channel.send(
                `Usage: ${this.usage}` +
                `\nType \`${prefix}v5 help\` for more info.`);
        }

        roll.rerollDice();
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
    return 'QuickReroll: Using the command without any DiceResults' +
        ' will perform a quick reroll. It will automaticly reroll up to' +
        ' 3 failed regular dice.' +
        '\nDiceResult: The number of the dice you wish to reroll.' +
        ' The list of dice can be found on the previous roll you made' +
        '\nNotes: See p122 and p158 of VtM v5 corebook for more info on ' +
        'rerolling with willpower.' +
        `\nPermissions: If the bot has access to the "Manage Messages" ` +
        `permission in the channel it will delete the original message. ` +
        `IF you do not want this functionality just disable the permission ` +
        `for this channel.` +
        `\nExamples: ${prefix}reroll 6 3 4` +
        `\n${prefix}rr 3\n${prefix}rr 7 2\n${prefix}reroll\n${prefix}rr`;
}