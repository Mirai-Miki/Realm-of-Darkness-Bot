'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc');
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI.js');

module.exports = class WoD20thInit
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.response = {};
        this.modifier = this.interaction.options.getInteger("dexterity_wits");
        this.character = this.interaction.options.getString('character');
        this.notes = this.interaction.options.getString('notes');
    }

    async isArgsValid()
    {
        let description;
        if (this.character?.length > 50)
        {
            description = "Character name cannot be longer than 50 chars.";
        }
        else if (this.notes?.length > 300)
        {
            description = "Notes cannot be longer than 300 chars.";
        }
        else return true;

        const embed = new MessageEmbed()
            .setTitle("String Length Error")
            .setColor("#db0f20")
            .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png")
            .setDescription(
                `${description}` +
                "\n[Website](https://realmofdarkness.app/)" +
                " | [Patreon](https://www.patreon.com/MiraiMiki)"
            );
        
        this.interaction.reply({embeds: [embed], ephemeral: true});
        return false;
    }

    async roll()
    {
        this.results = {roll: 0, total: 0};
        this.results.roll = Roll.single(10);        
        this.results.total = this.modifier + this.results.roll;
    }

    async constructEmbed()
    {
        if (this.character)
        {
            const name = correctName(this.character);
            let char = await DatabaseAPI.getCharacter(name, 
                this.interaction.user.id, this.interaction);
            if (char == 'noChar') char = undefined;
            this.character = {
                name: name, 
                tracked: char,
            }; 
        }

        let embed = new MessageEmbed();    
        
        embed.setAuthor(
            {
                name: (
                    this.interaction.member?.displayName ??
                    this.interaction.user.username
                ), 
                iconURL: this.interaction.member?.displayAvatarURL() ??
                    this.interaction.user.displayAvatarURL()
            }
        );

        if (this.character)
        {
            embed.addField("Character", this.character.name);
            if (this.character.tracked?.thumbnail) 
                embed.setThumbnail(this.character.tracked.thumbnail)
        }

        embed.setTitle(`Initiative`);       

        embed.addField('Dex + Wits', `${this.modifier}`, true);
        embed.addField('1d10', `${this.results.roll}`, true);
        if (this.notes) embed.addField("Notes", this.notes);
        embed.addField('Initiative of', 
            `\`\`\`fix\n${this.results.total}\n\`\`\``);
        embed.setColor([186, 61, 22]);
        embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
        
        const links = "\n[Website](https://realmofdarkness.app/)" +
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
        embed.fields.at(-1).value += links;
        
        this.response.embed = embed;
        return embed;
    }

    async reply()
    {
        if (this.response.embed)
        {
            try
            {
                await this.interaction.editReply({embeds: [this.response.embed]});
            }
            catch(error)
            {
                console.error("Failed to reply to 20th Init roll");
                console.error(error);
            }
        }  
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.response = undefined;
        this.character = undefined;
    }
}