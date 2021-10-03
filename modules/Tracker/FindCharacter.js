'use strict';
const { minToMilli } = require('../util/util.js');
const DatabaseAPI = require('../util/DatabaseAPI');
const { character20thEmbed } = require('./embed/character20thEmbed.js');
const { character5thEmbed } = require('./embed/character5thEmbed.js');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { Versions } = require('../util/Constants.js');

module.exports = class FindCharacter
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.player = interaction.options.getUser('player');
        this.character;
        this.splat;
        this.pk;
        this.nameLists;
        this.nameDict;
        this.userId = interaction.user.id;
    }

    isArgsValid()
    {
        if (this.player)
        {
            // Check if user is ST or Admin
            this.userId = this.player.id;
        }
        return true;
    }

    async getCharacter()
    {
        let inter;
        if (!this.player) inter = this.interaction;
        let char = await DatabaseAPI.getCharacter(
            this.name, this.userId, inter, this.splat, this.pk);
        if (char == 'noChar')
        {
            this.interaction.editReply({ 
                content: (`Cannot find the character ${this.name}.`), 
                ephemeral: true,
                components: []
            });
            return undefined;
        }
        else if (!char)
        {
            this.interaction.editReply({ 
                content: ('There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).'), 
                ephemeral: true,
                components: []
            });
            return undefined;
        }
        this.character = char;
        return char;
    }

    async get_name_list()
    {
        if (!this.isArgsValid()) return false;

        const guildId = this.interaction.guildId;
        const response = await DatabaseAPI.getNameList(this.userId, guildId);

        if (response === 'noChar')
        {
            this.interaction.reply({ 
                content: (`This player has no Characters.`), 
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

    constructResponse()
    {
        if (!this.character) 
        {
            this.response = {
                content: 'Please select the character you wish to find.',  
                ephemeral: true           
            };
        }
    }

    constructEmbed()
    {
        if (this.character.version == Versions.v20)
        {
            this.response = 
                character20thEmbed(this.character, this.interaction.client);
        }
        else
        {
            this.response = 
                character5thEmbed(this.character, this.interaction.client);
        }
        
        return this.response;
    }

    constructComponents()
    {
        const actionsRows = []
        let count = 0;
        for (const list of this.nameLists)
        {
            const actionRow = new MessageActionRow()
            actionRow.addComponents(
                new MessageSelectMenu()
                    .setCustomId(`get_char_${count}`)
                    .setPlaceholder("Choose a Character")
                    .setMaxValues(1)
                    .addOptions(list)
            );
            actionsRows.push(actionRow);
            count++;
        }        
        
        this.response['components'] = actionsRows;
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
            const char = this.nameDict[i.values[0]]
            this.pk = char.id;
            this.splat = char.splat;
            this.name = char.name;
            if (!await this.getCharacter()) return this.collector.stop();
            this.constructEmbed();
            this.response['components'] = [];
            this.response['content'] = null;
            await i.update(this.response);
            this.collector.stop();
        });
    }
}