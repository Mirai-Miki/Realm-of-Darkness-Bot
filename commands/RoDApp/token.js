'use strict';

const Database = require("../../modules/util/Database.js");
const crypto = require('crypto');
const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');

module.exports = {
    name: 'Realm of Darkness Token',
    aliases: ['token'],
    description: 'Security Token Generator for the Realm of Darkness',
    usage: `${prefix}token`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), { split: true });
        }

        let db = new Database();
        db.open('TokenDatabase', 'Database');
        let list = db.find('authenticate')

        if (!list) 
        {
            db.new('authenticate', {});
            list = db.find('authenticate');
        }

        Object.entries(list).forEach((entry) =>
        {
            const [key, value] = entry;
            if (value == message.author.id) 
            {
                delete list[key];
            }
            return;
        });
        
        let hash = createNewToken(message.author.id, list);
        db.add('authenticate', list);
        db.close();
        
        message.author.send(`Here is you token\n${hash}\n` +
            `Please keep this token private. Think of it like a password.`)
        .then(() =>
        {
            if (message.guild) 
            {
                message.channel.send(`<@${message.author.id}> I DMed you the token.`);
            }            
        })
        .catch(() => 
        {
            message.channel.send(`<@${message.author.id}> ` +
                `\nI could not DM you the token, please change you settings ` +
                `or DM me the command.`);
        });
    }          
}

function createNewToken(userID, list)
{
    let id = userID;
    let hash;
    let rand =  Math.floor(Math.random() * 1000000);

    id += rand.toString();
    id += Date.now();

    hash = crypto.createHash('sha256').update(id).digest('base64');
    list[hash] = userID;
    return hash
} 

function getHelpMessage()
{
    return 'Notes: Type in the command and your Security token will be provided' +
        ' to you.\nPlease keep you token secure, treat it as if it were' +
        ' a password.\nEnter the token in [Redacted] and you will be able to' +
        ` [Redacted]\n\nEntering the command again will issue you a new token` +
        ` and the old one will no longer function`;
}