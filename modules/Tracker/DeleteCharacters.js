'use strict';
const { minToMilli } = require('../util/util.js');
const DatabaseAPI = require('../util/DatabaseAPI');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')

module.exports = class DeleteCharacters
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.name = interaction.options.getString('name');
        this.character;
        this.toDelete;
        this.nameList;
        this.nameDict;
        this.response = {ephemeral: true}
    }

    async getNameList()
    {
        const guildId = this.interaction.guildId;
        const response = await 
            DatabaseAPI.getNameList(this.interaction.user.id, guildId);
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
        this.nameList = [];
        this.nameDict = {};
        for (const char of response)
        {
            this.nameList.push({
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
        return this.nameList;
    }

    async deleteCharacters()
    {
        const response = await DatabaseAPI.deleteCharacters(this.toDelete.ids);
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

        const actionRow = new MessageActionRow()
        actionRow.addComponents(
            new MessageSelectMenu()
                .setCustomId('delete_char')
                .setPlaceholder("Choose a Character")
                .addOptions(this.nameList)
                .setMinValues(1)
                .setMaxValues(this.nameList.length)
        );
        
        this.response['components'] = [actionRow];
    }

    confirmButton()
    {
        this.response['content'] = `Are you sure you want to delete ` +
            `${this.toDelete.names.join(', ')}? This cannot be undone.`;

        const actionRow = new MessageActionRow()
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
            i.message.interaction.id == this.interaction.id &&
            i.customId === 'delete_char'            
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
                await i.update(this.response);
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