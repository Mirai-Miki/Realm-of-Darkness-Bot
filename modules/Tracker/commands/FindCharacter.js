'use strict';
const { minToMilli } = require('../../util/misc.js');
const DatabaseAPI = require('../../util/DatabaseAPI');
const { character20thEmbed } = require('../embed/character20thEmbed.js');
const { character5thEmbed } = require('../embed/character5thEmbed.js');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { Versions } = require('../../util/Constants.js');

module.exports = class FindCharacter
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.player = interaction.options.getUser('player');
        this.showHistory = interaction.options.getBoolean('history');
        this.character;
        this.splat;
        this.pk;
        this.nameLists;
        this.nameDict;
        this.userId = interaction.user.id;
    }

    async isArgsValid()
    {
        let error = '';
        if (this.player)
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
        if (!await this.isArgsValid()) return undefined;

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
                character20thEmbed(
                    this.character, 
                    this.interaction.client
                );
        }
        else
        {
            this.response = 
                character5thEmbed(
                    this.character, 
                    this.interaction.client
                );
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
            if (!this.history)
            {
                const char = this.nameDict[i.values[0]]
                this.pk = char.id;
                this.splat = char.splat;
                this.name = char.name;
                if (!await this.getCharacter()) return this.collector.stop();
                this.constructEmbed();
                if (this.showHistory == null) 
                {
                    this.response['contant'] = null;
                    this.response['components'] = [];
                    await i.update(this.response);
                    return this.collector.stop();
                }
                this.history = this.parseHistory();                
                this.response['components'] = this.getHistoryButtons(0);
                this.response['content'] = this.history.pages[0];
                await i.update(this.response); 
            }
            else
            {
                // History button pressed
                if (i.customId === 'previous')
                {
                    this.history.currentPage--;
                }
                else
                {
                    this.history.currentPage++;
                }

                const currentPage = this.history.currentPage;

                this.response['content'] = 
                    this.history.pages[currentPage];
                this.response['components'] = this.getHistoryButtons(currentPage);
                await i.update(this.response);
            }
        });
    }

    parseHistory()
    {
        const history = {currentPage: 0, pages: []}
        let historyStr = ``;
        const charHistory = this.character.history;
        let count = 1;
        let page = 1;
        for (const record of charHistory)
        {
            if (count === 1) historyStr += 
                `__**History for ${this.character.name} || Page ${page}**__\n`;
            const args = JSON.parse(record.args);
            
            historyStr += `${record.date} Command: ${record.mode}, { `;
            const parsedArgs = [];
            for (const key of Object.keys(args))
            {
                const value = args[key];                
                parsedArgs.push(`${key}: ${value}`);
            }
            historyStr += (parsedArgs.join(', ') + ' }');
            if (record.notes) historyStr += ` ${record.notes}\n`;
            else historyStr += '\n';

            if (count == 5)
            {
                history.pages.push(historyStr);
                historyStr = '';
                count = 1;
                page++;
            }
            else count++;
        }
        if (count != 1) history.pages.push(historyStr);
        return history
    }

    getHistoryButtons(currentPage)
    {
        const actionRow = new MessageActionRow();
        let button = new MessageButton()
            .setCustomId('previous')
            .setStyle('DANGER')
            .setLabel("Previous")
        if (currentPage === 0) button.setDisabled();
        actionRow.addComponents(button);

        button = new MessageButton()
            .setCustomId('next')
            .setStyle('SUCCESS')
            .setLabel("Next")
        if (currentPage === (this.history.pages.length - 1)) button.setDisabled();
        actionRow.addComponents(button);

        return [actionRow];
    }
}

