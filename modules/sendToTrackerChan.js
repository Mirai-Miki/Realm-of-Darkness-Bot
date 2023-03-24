'use strict';
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI');
const { canSendMessage, canEmbed } = require('./misc');

module.exports = async function (embed, content, guildId, client)
{
    if (!guildId) return;

    const channelId = await DatabaseAPI.getTrackerChannel(guildId);
    if (!channelId) return;
    
    let channel;
    try
    {
        channel = await client.channels.fetch(channelId);
    }
    catch(error)
    {
        if (error.code ===10003) return; //Unknown Channel
        else console.log(error);
    }
    
    if (!channel) return;

    if (!canSendMessage(channel))
    {
        const debugChannel = await client.channels.fetch('776761322859266050');
        try
        {
            await debugChannel.send(`Missing "View Channel" or "Send Message" Permission` +
                ` for ${channel.guild.name}: #${channel.name}`);
        }
        catch(error)
        {
            console.error("\n\nFailed to send Tracker Chan Error!");
            console.error(error);
        }        
        return;
    }
    else if (!canEmbed(channel))
    {
        try
        {
            await channel.send(`Sorry, I need the "Embed Links" permission` +
                ' to work in this channel.');
        }
        catch(error)
        {
            console.error("\n\nFailed to send Tracker Chan Embed Error!");
            console.error(error);
        }
        return;
    }

    embed.ephemeral = false;
    embed.content = content;

    try
    {
        await channel.send(embed);
    }
    catch(error)
    {
        console.error("\n\nFailed to send Tracker Chan Message!");
        console.error(error);
    }
    
    channel = undefined;
}