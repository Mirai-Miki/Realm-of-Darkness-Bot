'use strict';

const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const Discord = require('discord.js');
const WoD5Contest = require('../../modules/dice/WoD5Contest.js');

module.exports = {
    name: 'Dice: WoD v5 Contested Roll',
    aliases: ['contest', 'vc', 'c'],
    description: 'Performs a contested roll against another Discord User.',
    usage: `${prefix}contest <@user> {notes}`,
    help: getHelpMessage(),

    async execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let contest = new WoD5Contest(message);
        if (!message.guild)
        {   // DM Command   
            contest.directMessage(message, content);
        }
        else if (message.mentions.members.first() &&
            message.mentions.members.first().id != message.author.id &&
            !message.mentions.members.first().user.bot)
        {
           
            let mentioned = message.mentions.members.first();
            
            // Guild Command
            contest.guildMessage(content);
            let failed = false;
            
            let dm = 'This will be a contested roll between' +
            ` ${mentioned.displayName} and ` +
            `${message.author.username}` +
            '.\nFirst let\'s start off by determining your Position.'
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Your Position")
            .setDescription("Are you the Attacker or the Defender in this" +
                " contest.\nThere can be more then one attacker depending" +
                " on the situation");
    
            await mentioned.send(dm, embed)
            .then(mess => 
                {
                    contest.userPositionCollector(mess);
                    mess.react('⚔️');
                    mess.react('🛡️');
                })
            .catch(error => {failed = true});
            await message.author.send(dm, embed)
            .then(mess => 
                {
                    contest.userPositionCollector(mess);
                    mess.react('⚔️');
                    mess.react('🛡️');
                })
            .catch(error => {failed = true});
            
            if (failed)
            {
                contest.removeSerializedData(contest.data.code);
                return message.channel.send(
                    `<@${mentioned.id}> <@${message.author.id}> ` +
                    'it seems like I can\'t DM one of you! Do ' +
                    'you have DMs disabled? Unfortunatly I need DMs for ' +
                    'this command to work.'
                );
            }
            
            let mention = content.match(/<@!\d{18}>/i);
            let notes = '';
            
            if (mention) notes = content.replace(mention[0], '');
            notes = notes.trim();

            let mess = `<@${mentioned.id}>, You have been ` +
                `challenged to a contested roll by <@${message.author.id}>. ` +
                `Please find the details in your DMs.`;

            if (notes) mess += `\n**Contest Notes:** ${notes}`;
            
            message.channel.send(mess)
        }
        else
        {
            return message.channel.send(
                `Usage: ${this.usage}` +
                `\nType \`${prefix}c help\` for more info.`);
        }
    }
}

function getHelpMessage()
{
    return 'user: A Discord @mention of the user you wish to challenge.' +
        '\nNotes: Both users need to have DMs with the bot turned on.' +
        `\nExamples: ${prefix} @name Reason for the challenge`;
}