const { prefix } = require('../../config.json');
const Database = require('../../modules/util/Database.js');

const Help = require('../../modules/util/Help.js');

module.exports = {
    name: 'Tracker: Set Permissions',
    aliases: ['permissions', 'perm', 'p'],
    description: 'Set roles as privileged users.',
    usage: `${prefix}perm <Role> {Role}...\nOR ${prefix}perm`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        let db = new Database();
        db.open('Permissions', 'Database');
        
        let perms;
        if (message.member) perms = db.find(message.member.guild.id);
        if (!perms) perms = {};

        let ret = `<@${message.author.id}> `;
        let modified = false;
        
        if (!message.member)
        {
            ret += "This command needs to be used in a server."
        }
        else if (!message.member.hasPermission("ADMINISTRATOR"))
        {
            ret += "This command can only be used by and Admin of this server.";
        }
        else if (!content.match(/<@&\d+>/ig))
        {
            if (!Object.keys(perms).length) 
                ret += "There is no roles added yet.\n"
            else
            {
                ret += "Here is a list of all the ST roles:\n"
                for (let role of Object.values(perms))
                {          
                    let snowflake = role.match(/\d+/)[0];
                    if (!message.member.guild.roles.resolve(snowflake))
                    {
                        perms[role] = undefined;
                        modified = true;
                    }
                    else
                    {
                        ret += `${role}\n`;
                    }
                }
            }
        }
        else if (content.match(/<@&\d+>/ig))
        {
            let roles = content.match(/<@&\d+>/ig);            
            let added = "";
            let removed = "";
            for (let role of roles)
            {
                if (perms[role])
                {
                    perms[role] = undefined;
                    removed += `${role} `;
                }
                else 
                {
                    perms[role] = role;
                    added += `${role} `;
                }
                modified = true;
            }
            if (added) ret += `Added: ${added}\n`;
            if (removed) ret += `Removed: ${removed}`;       
        }

        if (modified)
        {
            db.add(message.member.guild.id, perms)
            db.close();
        }
        
        message.channel.send(ret);        
    }
}

function getHelpMessage()
{
    return 'Role: The mentioned role you wish to add/remove. You can add ' +
    'as many as you like in a single command.' +
    ' Adding a role that is already there will remove it.' +
    ' If no Role is added the command will list all the Roles already stored' +
    '\nPermissions: This command requires Discord Admin permissions.' +
    `\nExamples:\n${prefix}perm StoryTellerRole ModRole\n${prefix}perm`;
}