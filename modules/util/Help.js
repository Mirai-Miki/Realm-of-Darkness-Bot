'use strict';

module.exports = class Help
{
    constructor()
    {

    }

    static command(command)
    {
        if (!command) {
            return ('that\'s not a valid command!');
        }

        let help = (`**${command.name}**\n\`\`\`yaml\n`);

        if (command.aliases) help += 
            (`Commands: ${command.aliases.join(', ')}\n`);

        if (command.description) help += 
            (`Description: ${command.description}\n`);

        if (command.usage) help += 
            (`Usage: ${command.usage}\n`);

        help += ('\n```\n');

        if (command.help) help += 
            (`**Usage Help**\n\`\`\`yaml\n` +
            `${command.help}\n\`\`\``);
        return help;
    }
}