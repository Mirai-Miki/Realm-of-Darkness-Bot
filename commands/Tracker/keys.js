const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const Discord = require('discord.js');
const fs = require("fs");

splats = new Discord.Collection();

const handlersFiles = fs.readdirSync('./modules/Tracker/handlers/')
    .filter(file => file.endsWith('.js'))
for (const file of handlersFiles) 
{
    const handler = require(`../../modules/Tracker/handlers/${file}`);
    splats.set(handler.name, handler);
}

module.exports = {
    name: 'Tracker: Key Help',
    aliases: ['keys', 'key'],
    description: 'List all splats and the keys used to create them. Adding the' +
        'splat to the command will give specific help information about' +
        ' that specific splat.',
    usage: `${prefix}keys\nOR ${prefix}keys <splatKey>`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let help = ""
        
        if (content.match(/^\s*(--force)?\s*$/i)) {
            help += ('Here\'s a list of all my Splats\n\n');
            
            splats.map(splat => 
            {
                help += `**${splat.name}** \n\`\`\`yaml\n`;
                help += `version: ${splat.version}\n`;
                help += `splat: ${splat.splat}\n`;
                help += `More Help: ${prefix}keys ${splat.keyHelp}\n\`\`\`\n`
            });            

            help += (`You can send \`${prefix}keys <splatKey>\` ` +
                `to get info on a specific Splat!`);
            if (content.match(/--force/i))
                return message.channel.send(help, { split: true });

            return message.author.send(help, { split: true })
            	.then(() => {
            		if (message.channel.type === 'dm') return;
            		message.reply('I\'ve sent you a DM with all my Splats!');
            	})
            	.catch(error => {
            		console.error(`Could not send help DM to ` +
                        `${message.author.tag}.\n`, error);
            		message.reply('it seems like I can\'t DM you! Do ' +
                        'you have DMs disabled?');
            	});
        }

        const name = args[0].toLowerCase();
        const splat = splats.find(
            splat => splat.keyHelp && splat.keyHelp == name);
        
        if (!splat) return message.reply("Sorry that is not a valid" +
            ' KeyHelp command.\n' +
            'Please type `/keys` for a list of all KeyHelp commands.');

        for (let key of Object.values(splat.getKeys()))
        {
            help += `**${key.name}** \n\`\`\`yaml\n` +
                `Keys: ${key.keys.join(', ')}\n`;
            if (key.options) help += `Options: ${key.options.join(', ')}\n`;
            if (key.required) help += `Required: ${key.required}\n`;
            if (key.constraints) help += 
                `Constraints: Min Value ${key.constraints.min},` +
                ` Max Value ${key.constraints.max}\n`;
                
            help += `Description: ${key.description}\n\`\`\`ﾠ\n`;
        }
        
        message.author.send(help, { split: {char: 'ﾠ'} })
        	.then(() => {
        		if (message.channel.type === 'dm') return;
        		message.reply('I\'ve sent you a DM with all my Keys!');
        	})
        	.catch(error => {
        		console.error(`Could not send help DM to ` +
                    `${message.author.tag}.\n`, error);
        		message.reply('it seems like I can\'t DM you! Do ' +
                    'you have DMs disabled?');
        	});
    }
}

function getHelpMessage()
{
    return 'splatKey: can be found when using the /keys on its own.' +
        `\nExamples: ${prefix}keys` +
        `\n${prefix}keys vampire5th`;
}