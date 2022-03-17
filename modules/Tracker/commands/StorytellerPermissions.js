'use strict';
const DatabaseAPI = require('../../util/DatabaseAPI');

module.exports = class TrackerChannel
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.role = interaction.options.getRole('role');

        if (this.role) this.setSTRole();
        else this.getSTRoles();
    }

    isArgsValid()
    {
        // TODO check is user is ST

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
            this.interaction.reply({content: content, ephemeral: true});
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

        this.interaction.reply({content: content, ephemeral: true});
    }

    async getSTRoles()
    {
        let content = this.isArgsValid();
        if (content)
        {
            this.interaction.reply({content: content, ephemeral: true});
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

        this.interaction.reply({content: content, ephemeral: true});
    }
}