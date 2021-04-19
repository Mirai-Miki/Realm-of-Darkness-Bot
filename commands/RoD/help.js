const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');

module.exports = {
    name: 'Command Help',
    aliases: ['help', 'rod', 'commands'],
    description: 'Lists all of my commands',
    usage: `${prefix}help {--force}\nOR ${prefix}help <commandName>`,
    args: true,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        let help = "";
        const { commands } = message.client;

        if (content.match(/^\s*(--force)?\s*$/i)) 
        {
        	help += ('Here\'s a list of all my commands\n\n');
            commands.map(command => 
            {
                help += `**${command.name}** \n\`\`\`yaml\n`;
                help += `Commands: ${command.aliases.join(', ')}\n`;
                help += `Description: ${command.description}\n\`\`\`\n`;

            });            
            
            help += (`You can send \`${prefix}help [command name]\` ` +
                `to get info on a specific command!\n` +
                'If you are having trouble using /command try using' +
                '\\command instead.');

            if (content.match(/--force/i))
                return message.channel.send(help, { split: true });

            return message.author.send(help, { split: true })
            	.then(() => {
            		if (message.channel.type === 'dm') return;
            		message.reply('I\'ve sent you a DM with all my commands!');
            	})
            	.catch(error => {
            		console.error(`Could not send help DM to ` +
                        `${message.author.tag}.\n`, error);
            		message.reply('it seems like I can\'t DM you! Do ' +
                        'you have DMs disabled?');
            	});
        }
        
        // Trying to locate a bug in this line
        if (!args[0]) console.log(message.content);
        const name = args[0].toLowerCase();
        const command = commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(name));
        message.channel.send(Help.command(command), 
            { split: true });
    }
}

function getHelpMessage()
{
    return 'No Args: Using the command alone will send a list of all' +
        ' the bots commands to you in a DM' +
        '\nforce: Adding the --force argument to the help command will' +
        ' force it to send the command list in the channel that it was ' +
        'requested in.' +
        '\ncommandName: Adding the command name to the help command will' +
        ' send you more information on that specific command in the channel' +
        ' that it was requested.';
}