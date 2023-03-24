'use strict';
const Discord = require("discord.js");

module.exports = class Tunnel
{
    static canTunnel(mess, channelID)
    {
        const channel = mess.guild.channels.cache.get(channelID);
        if (!mess.channel.permissionsFor(mess.client.user.id)
            .has("MANAGE_MESSAGES"))
        {
            mess.reply('sorry, I need the "Manage Messages" permission' +
                " for this channel.")
            return false;
        }
        else if (!channel.permissionsFor(mess.client.user.id)
            .has(["SEND_MESSAGES", "EMBED_LINKS"]))
        {
            mess.reply('Sorry, I need the "Send Messages" and "Embed Links" ' +
                'permissions in the exit channel');
            return false;
        }
        else return true;
    }
    static toChannel(mess, channelID)
    {
        const attachment = mess.attachments.first();
        const channel = mess.guild.channels.cache.get(channelID);

        const embed = new Discord.MessageEmbed()
	        .setColor('#ccb325')
	        .setAuthor(mess.member ? 
                mess.member.displayName : mess.author.username, 
                mess.author.displayAvatarURL())
            .setDescription(`${mess.content}`)
            .setURL(attachment ? attachment.url : '')
            .setImage(attachment ? attachment.url : '')
            .setTitle(attachment ? `${attachment.name}` : '')
            .setTimestamp()

        channel.send(embed).then(x => {mess.delete()});
    }
}