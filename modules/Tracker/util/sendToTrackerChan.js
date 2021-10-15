'use strict';

module.exports = async function (embed, content, interaction)
{
    const client = interaction.client;

    const channelId = '719423357380198440'; // Change to a API retrieve
    let channel;

    if (channelId)
    {
        channel = await client.channels.fetch(channelId);
    }
    else return;

    // Check Channel Permissions

    embed.ephemeral = false;
    embed.content = content;

    channel.send(embed);
    // DiscordAPI.getTrackerChannel(guildId)
}