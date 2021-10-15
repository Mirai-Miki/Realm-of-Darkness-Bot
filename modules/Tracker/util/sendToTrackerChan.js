'use strict';
const DatabaseAPI = require('../../util/DatabaseAPI');

module.exports = async function (embed, content, interaction)
{
    const client = interaction.client;
    if (!interaction.guildId) return;

    const channelId = await DatabaseAPI.getTrackerChannel(interaction.guildId);
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
}