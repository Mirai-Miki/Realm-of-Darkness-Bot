'use strict';
const DatabaseAPI = require('../../util/DatabaseAPI');
const { canSendMessage, canEmbed } = require('../../util/misc')

module.exports = async function (embed, content, guildId, client)
{
    if (!guildId) return;

    const channelId = await DatabaseAPI.getTrackerChannel(guildId);
    let channel;
    if (channelId)
    {
        channel = await client.channels.fetch(channelId);
    }
    else return;

    // Check Channel Permissions
    if (!canSendMessage(channel))
    {
        const debugChannel = await client.channels.fetch('776761322859266050');
        debugChannel.send(`Missing "View Channel" or "Send Message" Permission` +
            ` for ${channel.guild.name}: #${channel.name}`);
        return;
    }
    else if (!canEmbed(channel))
    {
        channel.send(`Sorry, I need the "Embed Links" permission` +
            ' to work in this channel.');
        return;
    }

    embed.ephemeral = false;
    embed.content = content;

    channel.send(embed);
}