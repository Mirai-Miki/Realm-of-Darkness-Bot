'use strict';
const { minToMilli } = require('../../util/misc.js');
const DatabaseAPI = require('../../util/DatabaseAPI');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')

module.exports = class DeleteCharacters
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.player = interaction.options.getUser('player');
        this.character;
        this.toDelete;
        this.nameLists;
        this.nameDict;
        this.response = {ephemeral: true};
        this.userId = this.interaction.user.id;
    }

    async isArgsValid()
    {
        let error = '';
        if (this.player && (this.player.id === this.userId))
        {
            this.player = null;
        }
        else if (this.player)
        {
            if (!this.interaction.guild)
            {
                error = 'Sorry, selecting a player can only be used in a server.';
                await editReply(this.interaction, {content: error, ephemeral: true}, "1");
                this.cleanup();
                return false;
            }

            const member = this.interaction.member;
            const roles = await DatabaseAPI.getSTRoles(this.interaction.guild.id);

            if (roles === undefined)
            {
                error = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
            }
            else if (member && (!member.permissions.has("ADMINISTRATOR") && 
                !member.roles.cache.hasAny(...roles)))
            {
                error = 'Sorry, you must either be an Administrator or Storyteller' +
                    ' to select another user.';
            }
            this.userId = this.player.id;
        }        

        if (error)
        {
            await editReply(this.interaction, {content: error, ephemeral: true}, "2");
            this.cleanup();
            return false;
        }
        return true;
    }

    async getNameList()
    {
        if (!await this.isArgsValid()) return undefined;

        const guildId = this.interaction.guildId;
        const response = await 
            DatabaseAPI.getNameList(this.userId, guildId);
        if (response === 'noChar')
        {
            await editReply(this.interaction, { 
                content: (`There are no Characters to delete.`), 
                ephemeral: true 
            }, "3");
            this.cleanup();
            return undefined;
        }
        else if (!response)
        {
            await editReply(this.interaction, { 
                content: ('There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).'), 
                ephemeral: true 
            }, "4");
            this.cleanup();
            return undefined;
        }

        this.nameLists = [];
        this.nameDict = {};
        let count = 0;
        let list = [];
        for (const char of response)
        {
            if (count == 25)
            {
                count = 0;
                this.nameLists.push(list);
                list = [];
            }
            count++;
            list.push({
                label: char.name,
                value: char.id,
                description: `Server: ${char.guildName}`
            });

            this.nameDict[char.id] = {
                id: char.id, 
                name:char.name, 
                splat:char.splat
            };
        }
        if (list.length)
        {
            this.nameLists.push(list);
        }

        return this.nameLists;
    }

    async deleteCharacters()
    {
        const response = await DatabaseAPI.deleteCharacters(
            this.toDelete.ids, this.player ? true : false);
        
        if (!response)
        {
            const content = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
            return {status: 'error', content: content};
        }
        return {status: 'deleted'};
    }

    async constructComponents()
    {
        this.response['content'] = 'Please select which Characters you would' +
            " like to delete. Please note that this is permanent.";

        const actionsRows = []
        let count = 0;
        for (const list of this.nameLists)
        {
            const actionRow = new MessageActionRow()
            actionRow.addComponents(
                new MessageSelectMenu()
                    .setCustomId(`del_char_${count}`)
                    .setPlaceholder("Choose a Character")
                    .setMaxValues(list.length)
                    .addOptions(list)
            );
            actionsRows.push(actionRow);
            count++;
        }        
        
        this.response['components'] = actionsRows;
    }

    confirmButton()
    {
        this.response['content'] = `Are you sure you want to delete ` +
            `${this.toDelete.names.join(', ')}? This cannot be undone.`;

        const actionRow = new MessageActionRow();
        actionRow.addComponents(
            new MessageButton()
                .setCustomId('cancel')
                .setStyle('SECONDARY')
                .setLabel("Cancel")
        );
        actionRow.addComponents(
            new MessageButton()
                .setCustomId('confirm')
                .setStyle('DANGER')
                .setLabel("Delete")
        );
        
        this.response['components'] = [actionRow];
    }

    async reply()
    {
        try
        {
            await this.interaction.editReply(this.response);
        }
        catch(error)
        {
            console.error("\n\nFailed to reply to Delete Character");
            console.error(error);
            this.cleanup();
            return;
        }

        const filter = i => (
            i.message.interaction.id == this.interaction.id           
        );
        const channel = 
            await this.interaction.client.channels.fetch(this.interaction.channelId);
        this.collector = channel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14),
            });
        
        this.collector.on('collect', async i => {
            await i.deferUpdate();
            this.toDelete = {ids: i.values, names: []}
            for (const pk of i.values) 
                this.toDelete.names.push(this.nameDict[pk].name);
                        
            const filter = i => (
                i.message.interaction.id == this.interaction.id &&
                (i.customId === 'cancel' || i.customId === 'confirm')
            );

            const confirmChannel = this.interaction.channel;
            this.confirmCollector = 
                confirmChannel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14),
            });

            this.confirmCollector.on('collect', async i => {
                await i.deferUpdate();
                await editReply(i, {content: "Loading...", components: []}, "5");
                
                if (i.customId === 'cancel')
                {
                    this.response['content'] = "Canceled";
                    this.response['components'] = [];                        
                    await updateInteraction(i, this.response, "2");
                    return this.confirmCollector.stop();
                }               
                
                const response = await this.deleteCharacters();
                if (response.status == 'error') 
                {
                    this.response['content'] = response.content;
                }
                else
                {
                    this.response['content'] = 
                    `**Deleted**: ${this.toDelete.names.join(', ')}.`;
                }                    
                this.response['components'] = []
                await editReply(i, this.response, "6");
                this.confirmCollector.stop();
            });

            this.confirmCollector.on('end', async i => {
                await editReply(this.interaction, {components: []}, "7");
                this.cleanup();
                // End of interaction: Character deleted
            });   

            this.confirmButton();                
            await updateInteraction(i, this.response, "1");           
            this.collector.stop();
        });

        this.collector.on('end', async (i, reason) => {
            if (reason === 'user') 
            {
                return; // Moved on to confirm buttons
            }
            // Timeout
            await editReply(this.interaction, {components: []}, "8");
            this.cleanup();
        });
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.character = undefined;
        this.toDelete = undefined;
        this.response = undefined;
        this.collector = undefined;
        this.confirmCollector = undefined;
        this.nameDict = undefined;
        this.nameLists = undefined;
    }
}

async function updateInteraction(interaction, response, updateCode)
{
    try
    {
        await interaction.editReply(response);
    }
    catch(error)
    {
        console.error(`\n\nFailed to update Delete Character: ${updateCode}`);
        console.error(error);
    }
}

async function editReply(interaction, response, editCode)
{
    try
    {
        await interaction.editReply(response);
    }
    catch(error)
    {
        console.error(`\n\nFailed to edit Reply Delete Character: ${editCode}`);
        console.error(error);
    }
}