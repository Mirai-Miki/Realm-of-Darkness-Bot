'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');

module.exports = class WoD20thInit
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.response = {};
        this.modifier = this.interaction.options.getInteger("dexterity_wits");
    }

    isArgsValid()
    {
        if (this.stats < 1 || this.stats > 50)
        {
            this.interaction.reply("Your Dex + Wits must be between" +
                " 1 and 50.");
        }
        else return true;
        return false;
    }

    roll()
    {
        this.results = {roll: 0, total: 0};
        this.results.roll = Roll.single(10);        
        this.results.total = this.modifier + this.results.roll;
    }

    constructEmbed()
    {
        let embed = new MessageEmbed();    
        
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
        );

        embed.setTitle(`V20 Initiative`);

        embed.addField('Dex + Wits', `${this.modifier}`, true);
        embed.addField('1d10', `${this.results.roll}`, true);
        embed.addField('Initiative of', 
            `\`\`\`fix\n${this.results.total}\n\`\`\``);
        embed.setColor([186, 61, 22]);
        embed.setURL('https://discord.gg/Za738E6');
        this.response.embed = embed;
        return embed;
    }

    reply()
    {
        if (this.response.embed)
        {
            this.interaction.reply({embeds: [this.response.embed]});
        }  
    }
}