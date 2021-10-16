'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');

module.exports = class Resonance
{
    constructor(interaction, surge=undefined)
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

        if (surge)
        {
            this.surge = this.interaction.options.getInteger('blood_surge');
            // No reroll on surge
        }
        else
        {
            const rerollv5 = this.interaction.options.getString('rouse');
            const reroll = this.interaction.options.getBoolean('reroll');

            if (rerollv5 === 'Reroll') this.results.reroll = true;
            if (reroll) this.results.reroll = true;
        }        
    }

    roll()
    {        
        this.results.dice.push(Roll.single(10));
        if (this.results.reroll) this.results.dice.push(Roll.single(10))
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
        const diceMess = [];
        for (const dice of this.results.dice)
        {
            diceMess.push(dice);
        }

        const embed = new MessageEmbed();
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
        );

        embed.setTitle(`${this.surge ? 'Blood Surge Check' : 'Rouse Check'}`);
        embed.setColor(this.results.colour);
        embed.setURL('https://discord.gg/Za738E6');
        
        if (!this.results.passed)
            embed.setThumbnail('https://cdn.discordapp.com/attachments/7140' +
            '50986947117076/886855116035084288/RealmOfDarknessSkullnoBNG.png');
        
        embed.addField("Rouse Dice", `${diceMess.join(' ')}ﾠ`);
        
        embed.addField("Result", `\`\`\`diff\n` +
            `${this.results.description}\n\`\`\``);

        if (this.notes) embed.setFooter(this.notes);
        
        this.response.embeds = [embed];
        return embed;
    }

    async reply(followUp)
    {
        if (followUp)
        {
           await this.interaction.followUp({
                embeds: this.response.embeds
            });
        }
        else
        {
            await this.interaction.reply({
                embeds: this.response.embeds
            });
        }
    }
}