'use strict';

const { prefix } = require('../../config.json');
const Help = require('../../modules/util/Help.js');
const Discord = require('discord.js');
const Database = require("../../modules/util/Database");

module.exports = {
    name: 'Channel Tunnel',
    aliases: ['tunnel', 'tun'],
    description: 'Sets up a channel tunnel where ever message send in the' +
        ' entrence channel will taken and posted in the exit channel',
    usage: `${prefix}tunnel {#exit_channel}`,
    help: getHelpMessage(),

    execute(message, args, content) 
    {
        if (args[0] && args[0].match(/help/i))
        {
            return message.channel.send(Help.command(this), 
                { split: true });
        }

        if (!message.guild)
        {
            message.reply("this command can only be used in a server.");
            return;
        }

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("this command requires admin permissions.")

        const db = new Database();
        db.open("Tunnel", "Database");
        const channel = message.mentions.channels.first()
        if (channel)
        {
            db.add(message.channel.id, channel.id);
            message.reply(`Tunnel created. \nEntrance: <#${message.channel.id}>\n` +
                `Exit: <#${channel.id}>`)            
        }
        else
        {
            if (db.delete(message.channel.id))
            {
                for (const [key, value] of Object.entries(db.db)) 
                {
                    if (value === message.channel.id)
                    {
                        db.delete(key);
                        message.reply("Tunnel ended.");
                        db.close();
                        return;
                    }
                }
                message.reply("There was no #exit_channel mentioned and" +
                    " no tunnel already exists.")
            }
            else
            {
                message.reply("Tunnel ended.");
            }
        }
        db.close();
    }
}

function getHelpMessage()
{
    return '#exit_channel: (optional) The mentioned channel you ' +
        'want the messages to  be moved to.' +
        '\nNotes: The channel in which the command is used will be the ' +
        'entrance channel. Sending the command without an #exit_channel' +
        ' will end the tunnel if one exists.' +
        `\nPermissions: Only Admins can use this command. The bot will also` +
        ` require "Manage Messages" permission in the entrance channal.` +
        `And the "Send Messages", "Embed Links" in the exit channel.` +
        `\nExamples: ${prefix}tunnel #channel_name` +
        `\n${prefix}tun`;
}