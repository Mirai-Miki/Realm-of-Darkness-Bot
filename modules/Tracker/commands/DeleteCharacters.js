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
                this.interaction.reply({content: error, ephemeral: true});
                return false;
            }

            const member = this.interaction.member;
            const roles = await DatabaseAPI.getSTRoles(this.interaction.guild.id);

            if (roles === undefined)
            {
                error = 'There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).';
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
            this.interaction.reply({content: error, ephemeral: true});
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
            this.interaction.reply({ 
                content: (`There are no Characters to delete.`), 
                ephemeral: true 
            });
            return undefined;
        }
        else if (!response)
        {
            this.interaction.reply({ 
                content: ('There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).'), 
                ephemeral: true 
            });
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
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).';
            return {status: 'error', content: content};
        }
        return {status: 'deleted'};
    }

    constructComponents()
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
        await this.interaction.reply(this.response);

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
            this.toDelete = {ids: i.values, names: []}
            for (const pk of i.values) 
                this.toDelete.names.push(this.nameDict[pk].name);
            this.confirmButton();                
            await i.update(this.response);
            
            const filter = i => (
                i.message.interaction.id == this.interaction.id &&
                (i.customId === 'cancel' || i.customId === 'confirm')
            );
            const confirmChannel = 
                await this.interaction.client.channels.fetch(this.interaction.channelId);
            this.confirmCollector = 
                confirmChannel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14),
            });
            this.confirmCollector.on('collect', async i => {
                if (i.customId === 'cancel')
                {
                    this.response['content'] = "Canceled";
                    this.response['components'] = [];                        
                    await i.update(this.response);
                    return this.confirmCollector.stop();
                }                
                await i.deferUpdate();
                await i.editReply({content: "Loading...", components: []});
                
                const response = await this.deleteCharacters();
                if (response.status == 'error') 
                {
                    this.response['content'] = response.content;
                }
                else
                {
                    this.response['content'] = 
                    `${this.toDelete.names.join(', ')}, Deleted.`;
                }                    
                this.response['components'] = []
                await i.editReply(this.response);
                this.confirmCollector.stop();
            });
            this.confirmCollector.on('end', i => {
                this.interaction.editReply({components: []});
            });
            
            this.collector.stop();
        });

        this.collector.on('end', (i, reason) => {
            if (reason === 'user') return;
            this.interaction.editReply({components: []});
        });
    }
}