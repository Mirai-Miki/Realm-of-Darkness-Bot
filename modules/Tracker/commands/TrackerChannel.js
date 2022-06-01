'use strict';
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI');
const { canSendMessage, canEmbed } = require('../../util/misc')

module.exports = class TrackerChannel
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.channel = interaction.options.getChannel('channel');
    }

    async isArgsValid()
    {
        const member = this.interaction.member;        
        
        if (!this.interaction.guild)
        {
            return 'Sorry, this command can only be used in a server.'
        }

        const roles = await DatabaseAPI.getSTRoles(this.interaction.guild.id);

        if (roles === undefined)
        {
            return 'There was an error accessing the Database. Please try again' +
            ' later.\nIf this issue persists please report it at the ' +
            '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
        }
        else if (member && (!member.permissions.has("ADMINISTRATOR") && 
            !member.roles.cache.hasAny(...roles)))
        {
            return 'Sorry, you must either be an Administrator or Storyteller' +
                ' to use this command.';
        }        
        else if (this.channel.isThread())
        {
            return 'Sorry, the channel cannot be a Thread.'
        }
        else if (!this.channel.isText())
        {
            return 'Sorry, Please select a text channel.';
        }
        else if (!canSendMessage(this.channel))
        {
            return `Sorry, you need to change the channel permissions to` +
                ' use that channel. I need the "View Channel", "Send Messages"' +
                ' and "Embed Links" Permissions to work correctly.';
        }
        else if (!canEmbed(this.channel))
        {
            return `Sorry, I need the "Embed Links" permission` +
                ' to work in this channel.';
        }
        return '';
    }

    async setChannel()
    {
        let content = await this.isArgsValid();
        if (content)
        {
            await editReply(this.interaction, {content: content, ephemeral: true}, "1");
            return;
        }

        const response = await DatabaseAPI.setTrackerChannel(
            this.interaction.guild, this.channel.id);
        if (!response)
        {
            content = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
        }
        else if (response.removed)
        {
            content = `#${this.channel.name} Is no longer the tracker Channel.`;
        }
        else
        {
            content = `#${this.channel.name} has been set as the tracker Channel.`;
        }
        await editReply(this.interaction, {content: content, ephemeral: true}, "2");
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.channel = undefined;
    }
}

async function editReply(interaction, response, code)
{
    try
    {
        await interaction.editReply(response);
    }
    catch(error)
    {
        console.error(`\n\nFailed to editReply at Tracker Channel: ${code}`);
        console.error(error);
    }
}