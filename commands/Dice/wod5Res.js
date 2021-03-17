const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const WoD5Res = require('../../modules/dice/WoD5Res.js');
const Discord = require('discord.js');

module.exports = {
    name: 'Dice: WoD v5 Resonance Roll',
    aliases: ['resonance', 'res', 'temp'],
    description: 'Rolls some D10 acording to the the random Resonance rules' +
        ' on page 228 of the 5th edition corebook and returns the Resonance' +
        ' aquired.',
    usage: `${prefix}res`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let roll = new WoD5Res();
        let notes = content.replace(/^\s+/, '');
        let embed = roll.constructEmbed(message, notes);

        message.channel.send(embed);

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
    return 'Arguments: This command does not require anything additional' +
        '\nNotes: See p226 to p231 of VtM v5 corebook for more info on ' +
        'temperament and Resonance.' +
        `\nPermissions: If the bot has access to the "Manage Messages" ` +
        `permission in the channel it will delete the original message. ` +
        `IF you do not want this functionality just disable the permission ` +
        `for this channel.` +
        `\nExamples: ${prefix}temp` +
        `\n${prefix}res\n${prefix}resonance`;
}