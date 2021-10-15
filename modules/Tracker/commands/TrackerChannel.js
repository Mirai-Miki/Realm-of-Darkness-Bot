'use strict';
const DatabaseAPI = require('../../util/DatabaseAPI');

module.exports = class TrackerChannel
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.channel = interaction.options.getChannel('channel');
    }

    isArgsValid()
    {
        // TODO check is user is ST

        if (!this.channel.isText())
        {
            return 'Sorry, Please select a text channel.';
        }
        else if (this.channel.isThread())
        {
            return 'Sorry, the channel cannot be a Thread.'
        }

        // TODO Check channel permissions. The bot needs to be able to see,
        // Post and Embed Links
        return '';
    }

    async setChannel()
    {
        let content = this.isArgsValid();
        if (content)
        {
            this.interaction.reply({content: content, ephemeral: true});
            return;
        }

        const response = DatabaseAPI.setTrackerChannel();
        if (!response)
        {
            content = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).';
        }
        else if (response === 'removed')
        {
            content = `<${this.channel.name}> Is no longer the tracker Channel.`;
        }
        else
        {
            content = `<$${this.channel.name}> has been set as the tracker Channel.`;
        }

        this.interaction.reply({content: content, ephemeral: true});
    }
}