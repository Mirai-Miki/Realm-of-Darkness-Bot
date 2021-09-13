'use strict';
const Roll = require('../Roll.js');
const Util = require('../../util/Util.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Resonance
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.notes = this.interaction.options.getString('notes');
        this.results = {
            dice: [], 
            reroll: false,
            passed: false,
            description: '- Hunger Increased -',
            colour: [143, 6, 33]
        };
        this.response = {embeds: [], components: []};
    }

    roll()
    {        
        this.results.dice.push(Roll.single(10));
        for (const dice of this.results.dice)
        {
            if (dice >= 6) 
            {
                this.results.description = "Unchanged";
                this.results.colour = [48, 33, 33];
                this.results.passed = true;
            }
        }
    }

    constructEmbed()
    {
        const embed = new MessageEmbed();
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
        );

        embed.setTitle('Rouse Roll');
        embed.setColor(this.results.colour);
        embed.setURL('https://discord.gg/Za738E6');
        
        if (!this.results.passed)
            embed.setThumbnail('https://cdn.discordapp.com/attachments/7140' +
            '50986947117076/886855116035084288/RealmOfDarknessSkullnoBNG.png');
        
        embed.addField("Dice", `${this.results.dice[0]}`, true);
        if (this.results.reroll) 
            embed.addField("Reroll", `${this.results.dice[1]}`, true);
        
        embed.addField("Result", `\`\`\`diff\n` +
            `${this.results.description}\n\`\`\``);

        if (this.notes) embed.setFooter(this.notes);
        
        this.response.embeds = [embed];
        return embed;
    }

    constructComponents()
    {
        if (this.results.passed) return;

        const buttonRow = new MessageActionRow()
        buttonRow.addComponents(
            new MessageButton()
                .setCustomId('reroll')
                .setLabel('Reroll')
                .setStyle('PRIMARY'),
        );
        
        this.response.components.push(buttonRow);
    }

    async reply(followUp)
    {
        let message;
        if (followUp)
        {
            message = await this.interaction.followUp({
                embeds: this.response.embeds, 
                components: this.response.components
            });
        }
        else
        {
            await this.interaction.reply({
                embeds: this.response.embeds, 
                components: this.response.components
            });
            message = await this.interaction.fetchReply();
        }

        if (!this.response.components.length) return; 
        // don't need to stick around if there is no buttons

        this.collector = message.createMessageComponentCollector(
            {
                time: Util.minToMilli(14)
            });
        
        this.collector.on('collect', async i => {
            if (i.user.id === this.interaction.user.id) {
                if (i.customId == 'reroll')
                {
                    // reroll
                    this.roll();                    
                    this.results.reroll = true;
                    this.constructEmbed();
                    await i.update({ 
                        embeds: this.response.embeds,                        
                        components: []
                    });
                    this.collector.stop();
                }
            } else {
                i.reply({ 
                    content: `These buttons aren't for you!`, 
                    ephemeral: true 
                });
            }
        });

        this.collector.on('end', i => {
            this.interaction.editReply({components: []});
        });
    }
}