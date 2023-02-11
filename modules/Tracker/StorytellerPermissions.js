'use strict';
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI');

module.exports = class StorytellerPermissions
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.role = interaction.options.getRole('role');
    }

    isArgsValid()
    {
        if (!this.interaction.guild)
        {
            return 'Sorry, this command can only be used in a server.'
        }
        else if (!this.interaction.member.permissions.has('ADMINISTRATOR'))
        {
            return 'Sorry, you need to be a server Admininstrator to use this.'
        }
        return '';
    }

    async setSTRole()
    {
        let content = this.isArgsValid();
        if (content)
        {
            await editReply(this.interaction, content, "1")
            return;
        }
        const response = await DatabaseAPI.setSTRole(
            this.interaction.guild, this.role.id);

        if (!response)
        {
            content = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
        }
        else if (response.removed)
        {
            content = `<@&${this.role.id}> Is no longer an ST role.`;
        }
        else
        {
            content = `<@&${this.role.id}> has been set as an ST role.`;
        }

        await editReply(this.interaction, content, "2")
    }

    async getSTRoles()
    {
        let content = this.isArgsValid();
        if (content)
        {
            await editReply(this.interaction, content, "3")       
            return;
        }

        const response = await DatabaseAPI.getSTRoles(
            this.interaction.guild.id);

        if (response === undefined)
        {
            content = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
        }
        else if (response.length === 0)
        {
            content = `There are currently no Storyteller roles set.`;
        }
        else
        {
            const roles = [];
            for (const role of response) roles.push(`<@&${role}> <${role}>`);
            content = `The Storyteller roles are:\n${roles.join('\n')}`;
        }
        await editReply(this.interaction, content, "4")
    }

    async cleanup()
    {
        this.interaction = undefined;
    }
}

async function editReply(interaction, content, code)
{
    try
    {
        interaction.editReply({content: content, ephemeral: true});
    }
    catch (error)
    {
        console.error(`\n\nFailed to reply to ST Perms: ${code}`);
        console.error(error);
    }  
}