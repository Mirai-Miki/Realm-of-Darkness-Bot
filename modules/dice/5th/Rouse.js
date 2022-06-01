'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc');
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI.js');
const { character5thEmbed } = require('../../Tracker/embed/character5thEmbed');

module.exports = class Rouse
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
        this.character = this.interaction.options.getString('character');

        if (this.interaction.options.getBoolean('reroll')) 
            this.results.reroll = true;
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
            .setDescription(`${description}` +
                "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
                " | [Patreon](https://www.patreon.com/MiraiMiki)");
        
        this.interaction.reply({embeds: [embed], ephemeral: true});
        return false;
    }

    async roll()
    {
        this.results.dice.push(Roll.single(10));
        if (this.results.reroll) this.results.dice.push(Roll.single(10))
        for (const dice of this.results.dice)
        {
            if (dice >= 6) 
            {
                this.results.description = "Hunger Unchanged";
                this.results.colour = [48, 33, 33];
                this.results.passed = true;
            }
        }
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
        
        const diceMess = [];
        for (const dice of this.results.dice)
        {
            diceMess.push(dice);
        }

        const embed = new MessageEmbed();
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

        embed.setTitle(`${this.surge ? 'Blood Surge Check' : 'Rouse Check'}`);
        embed.setColor(this.results.colour);
        embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
        
        if (!this.results.passed)
            embed.setThumbnail('https://cdn.discordapp.com/attachments/7140' +
            '50986947117076/886855116035084288/RealmOfDarknessSkullnoBNG.png');
        
        if (this.character)
        {
            embed.addField("Character", this.character.name);
            if (this.character.tracked?.thumbnail) 
                embed.setThumbnail(this.character.tracked.thumbnail)
        }

        embed.addField("Rouse Dice", `${diceMess.join(' ')}`);
        if (this.notes) embed.addField("Notes", this.notes);
        embed.addField("Result", `\`\`\`diff\n` +
            `${this.results.description}\n\`\`\``);

        
        const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
        embed.fields.at(-1).value += links;
        
        this.response.embeds = [embed];
        return embed;
    }

    async reply()
    {
        try
        {
            await this.interaction.editReply({embeds: this.response.embeds});
        }   
        catch(error)
        {
            console.error("Failed to send reply for v5 Rouse roll");
            console.error(error);
        }       

        if (!this.results.passed) await this.updateCharacter(1);
    }

    async updateCharacter(hunger)
    {
        if (!this.character?.tracked || 
            this.character.tracked.splat != 'Vampire' || 
            this.character.tracked.version != '5th' ||
            !hunger) return;
        
        this.character.tracked.hunger.updateCurrent(hunger);
        
        const resp = await DatabaseAPI.saveCharacter(this.character.tracked);
        if (resp != 'saved')
        {            
            this.interaction.followUp({
                content: "There was an error accessing the Database and" +
                " the character was not updated."
            });
        }
        else
        {
            this.interaction.followUp(
                character5thEmbed(
                    this.character.tracked, 
                    this.interaction.client
                )
            );
        }
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.character = undefined;
        this.results = undefined;
        this.response = undefined;
    }
}