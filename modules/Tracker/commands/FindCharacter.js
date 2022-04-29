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
                error = 'Sorry, selecting a player can only be used in a server.' +
                '\nIf you trying to find your own Character please' +
                ' remove the "player" option and try again.';
                await this.editReply(this.interaction, 
                    {content: error, ephemeral: true}, "1");
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
                    ' to select another user.\n' +
                    'If you are trying to find your own Character please' +
                    ' remove the "player" option and try again.';
            }
            
            this.userId = this.player.id;
        }        

        if (error)
        {
            await this.editReply(this.interaction, 
                {content: error, ephemeral: true}, "2");
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
            await this.editReply(this.interaction, { 
                content: (`Cannot find the character ${this.name}.`), 
                ephemeral: true,
                components: []
            }, "3");
            return undefined;
        }
        else if (!char)
        {
            await this.editReply(this.interaction, { 
                content: ('There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).'), 
                ephemeral: true,
                components: []
            }, "4");
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
            await this.editReply(this.interaction, { 
                content: (`This player has no Characters.`), 
                ephemeral: true 
            }, "5");
            return undefined;
        }
        else if (!response)
        {
            await this.editReply(this.interaction, { 
                content: ('There was an error accessing the Database. Please try again' +
                ' later.\nIf this issue persists please report it at the ' +
                '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).'), 
                ephemeral: true 
            }, "6");
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
                content: 'Please select the character you wish to find.'        
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
        if (!await this.editReply(this.interaction, this.response, "7"))
        {
            return;
        }
        
        const filter = i => (
            i.message.interaction.id == this.interaction.id          
        );
        const channel = this.interaction.channel;
        this.collector = channel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14),
            });
        
        this.collector.on('collect', async i => {
            await i.deferUpdate();
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
                    this.response['content'] = null;
                    this.response['components'] = [];
                    await updateInteraction(i, this.response, "1");
                    return this.collector.stop();
                }
                this.history = this.parseHistory();                
                this.response['components'] = this.getHistoryButtons(0);
                this.response['content'] = this.history.pages[0];
                await updateInteraction(i, this.response, "2"); 
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
                await updateInteraction(i, this.response, "3");
            }
        });

        this.collector.on('end', async i => {  
            await updateInteraction(this.interaction, 
                {components: []}, "4");          
            this.cleanup();
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

    async editReply(interaction, response, code)
    {
        try
        {
            await interaction.editReply(response);
        }
        catch(error)
        {
            console.error(`\n\nFailed to editReply Find Character: ${code}`);
            console.error(error);
            this.cleanup();
            return false;
        }
        return true;
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.character = undefined;
        this.splat = undefined;
        this.response = undefined;
        this.collector = undefined;
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
        console.error(`\n\nFailed to update Find Character: ${updateCode}`);
        console.error(error);
    }
}