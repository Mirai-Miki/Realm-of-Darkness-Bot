'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc');
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI.js');
const { character20thEmbed } = require('../../Tracker/embed/character20thEmbed.js');
const { Versions } = require('../../util/Constants')

module.exports = class WoD20thRoll
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.statsResult;

        this.pool = this.interaction.options.getInteger('pool');
        this.diff = this.interaction.options.getInteger('difficulty');
        this.willpower = this.interaction.options.getBoolean('willpower');
        this.mod = this.interaction.options.getInteger('modifier');
        this.spec = this.interaction.options.getString('speciality');
        this.reason = this.interaction.options.getString('notes');
        this.nightmare = this.interaction.options.getInteger('nightmare');
        this.character = this.interaction.options.getString('character');
        this.cancelOnes = this.interaction.options.getBoolean('no_botch');
    }

    async isArgsValid()
    {
        let description;
        let title = "String Length Error";
        if (this.character?.length > 50)
        {
            description = "Character name cannot be longer than 50 chars.";
        }
        else if (this.willpower && 
            this.character?.tracked?.willpower.current == 0)
        {
            const resp = character20thEmbed(
                this.character.tracked, this.interaction.client);
            resp['content'] = 'You are currently out of willpower.'
            this.interaction.reply(resp);
            return false;
        }
        else if (this.nightmare && (this.nightmare > this.pool))
        {
            title = "Invalid Nightmare Error";
            description = 'Nightmare cannot be more then your pool';
        }     
        else if (this.spec?.length > 100)
        {
            description = "Speciality cannot be longer than 100 characters.";
        }
        else if (this.reason?.length > 300)
        {
            description = "Notes cannot be longer than 300 chars.";
        }
        else return true;

        const embed = new MessageEmbed()
            .setTitle(title)
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
        let pool = this.pool - (this.nightmare ?? 0);
        const results = Roll.manySingle(this.pool, 10);
        this.results = {
            rolls: [],
            nightmareDice: [], 
            failed: [], 
            passed: [], 
            total: 0, 
            botch: false
        }
        let removed = 0;
        let tens = 0;
        let nightmareDice = false;
        
        for (let result of results['10'])
        {
            if (pool > 0)
            {
                this.results.rolls.push(result);
                pool--;
            }
            else
            {
                nightmareDice = true;
                this.results.nightmareDice.push(result);
            }            

            if (result == 1)
            {               
                this.results.failed.push(result);

                if (!this.cancelOnes)
                {
                    this.results.botch = true;
                    removed += 1
                }                
            }
            else if (this.spec && result == 10)
            {
                tens += 1;
                this.results.total += 2;
                this.results.passed.push(result);

                if (nightmareDice)
                {
                    // do nightmare things
                }
            }
            else if (result < this.diff)
            {
                this.results.failed.push(result);
            }
            else
            {
                this.results.total += 1;
                this.results.passed.push(result);
            }
        }
    
        // Removed 10s correctly
        let quantity = this.results.passed.length - tens; 
        for (removed; removed != 0; removed--)
        {    
            if (quantity)
            { 
                this.results.total -= 1;
                quantity -= 1;
            }
            else if (tens)
            {
                this.results.total -= 2;
                tens -= 1;
            }
            else
            {
                break;
            }
        }
        
        if (this.willpower) this.results.total += 1;
        if (this.mod) this.results.total += this.mod; 
        if (this.results.total < 0) this.results.total = 0;

        return;
    }

    async constructEmbed()
    {
        // Create the embed
        let embed = new MessageEmbed();

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
        await this.updateCharacter();
        
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

        let title = `Pool ${this.pool} | Diff ${this.diff}`;
        if (this.nightmare) title += ` | Nightmare ${this.nightmare}`
        if (this.willpower) title += ` | WP`;
        if (this.mod) title += ` | Mod ${this.mod}`;
        if (this.spec) title += ` | Spec`;
        if (this.cancelOnes) title += ` | No Botch`;
        embed.setTitle(title);

        const sortedResults = this.results.rolls.map((x) => x);
        sortedResults.sort((a, b) => b - a);

        const sortedNightmareDice = this.results.nightmareDice.map((x) => x);
        sortedNightmareDice.sort((a, b) => b - a);
        
        if (this.character)
        {
            embed.addField("Character", this.character.name);
            if (this.character.tracked?.thumbnail) 
                embed.setThumbnail(this.character.tracked.thumbnail)
        }
        
        const mess = [];
        for (let dice of sortedResults)
        {           
            if (dice == 10 && this.spec) mess.push('**10**');
            else if (dice >= this.diff) mess.push(`${dice}`);
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
                mess.push(`~~${dice}~~`);
            else mess.push(`**~~1~~**`);            
        }

        const nightmare = [];
        for (let dice of sortedNightmareDice)
        {           
            if (dice == 10) nightmare.push('**10**');
            else if (dice >= this.diff) nightmare.push(`${dice}`);
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
            nightmare.push(`~~${dice}~~`);
            else nightmare.push(`**~~1~~**`);            
        }
        
        if (mess.length) embed.addField("Dice", mess.join(", "), true);
        if (nightmare.length) 
        {
            embed.addField("Nightmare", nightmare.join(", "), true);
        }

        if (this.spec) embed.addField("Specialty", `${this.spec}`, true);
        
        if (this.mod) embed.addField("Modifier", `${this.mod}`, true);  
        if (this.reason) embed.addField("Notes", this.reason);

        if (!this.results.passed.length && !this.results.total && 
            this.results.botch)
        {
            // Botched the roll
            embed.addField('Result', '```diff\n- Botched\n```');
            embed.setColor([204, 12, 47]);
            this.statsResult = 'botched';
        }
        else if (!this.results.total)
        {
            // Failed the roll
            embed.addField('Result', '```fix\nFailed\n```');
            embed.setColor([224, 113, 2]);
            this.statsResult = 'failed';
        }
        else
        {
            // Passed the roll
            embed.addField('Result', `\`\`\`diff\n+ ` +
                `${this.results.total} success +\n\`\`\``);
            embed.setColor([50, 168, 82]);
            this.statsResult = 'passed';
        }
        
        const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
        embed.fields.at(-1).value += links;

        embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
        this.response = { embed: embed };
        return embed;
    }

    async constructContent()
    {
        const client = this.interaction.client;

        const emotes = {
            botch: client.emojis.resolve('901438266312650772').toString(),
            1: {fail: client.emojis.resolve('901438193528881212').toString()},
            2: {fail: client.emojis.resolve('901438197882564688').toString(), 
                sux: client.emojis.resolve('901438140781326376').toString()},
            3: {fail: client.emojis.resolve('901438198046134282').toString(), 
                sux: client.emojis.resolve('901438140487720960').toString()},
            4: {fail: client.emojis.resolve('901438197744152606').toString(), 
                sux: client.emojis.resolve('901438140106035320').toString()},
            5: {fail: client.emojis.resolve('901438198213910609').toString(), 
                sux: client.emojis.resolve('901438141498544199').toString()},
            6: {fail: client.emojis.resolve('901438198306197504').toString(), 
                sux: client.emojis.resolve('901438140257017887').toString()},
            7: {fail: client.emojis.resolve('901438197916123136').toString(), 
                sux: client.emojis.resolve('901438141284614144').toString()},
            8: {fail: client.emojis.resolve('901438199358963803').toString(), 
                sux: client.emojis.resolve('901438140810682408').toString()},
            9: {fail: client.emojis.resolve('901438198016774176').toString(), 
                sux: client.emojis.resolve('901438141938941992').toString()},
            sux10: client.emojis.resolve('901438140919709716').toString(),
            crit: client.emojis.resolve('901726422513614898').toString(),
            nightmare: client.emojis.resolve('901432906227007488').toString(),
            seperator: client.emojis.resolve('953616399799037982').toString()
        }
        
        let mess = '';
        for (const dice of this.results.rolls)
        {
            if (dice == 10)
            {
                if (this.spec) mess += emotes.crit;
                else mess += emotes.sux10;
            }
            else if (dice >= this.diff) mess += emotes[dice].sux;
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
                mess += emotes[dice].fail;
            else mess += emotes.botch;
            mess += ' ';
        }

        if (mess.length && this.nightmare) mess += emotes.seperator;
        for (const dice of this.results.nightmareDice)
        {
            if (dice == 10)
            {
                mess += emotes.nightmare;
            }
            else if (dice >= this.diff) mess += emotes[dice].sux;
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
                mess += emotes[dice].fail;
            else mess += emotes.botch;
            mess += ' ';
        }

        this.response.content = mess;
        return mess;
    }

    async updateCharacter()
    {
        if (!this.character?.tracked || !this.willpower || 
            this.character.tracked.version == Versions.v5) return;

        this.character.tracked.willpower.updateCurrent(-1);
        const resp = await DatabaseAPI.saveCharacter(this.character.tracked);
        if (resp != 'saved')
        {
            this.followUp = {
                content: "There was an error accessing the Database and" +
                " the character was not updated."
            }
        }
        else
        {
            this.followUp = 
                character20thEmbed(this.character.tracked, this.interaction.client);
        }
    }

    async reply()
    {
        if (this.response)
        {
            try
            {
                await this.interaction.editReply({ 
                    content: this.response.content,  
                    embeds: [this.response.embed] 
                });
            }
            catch(error)
            {
                console.error("Failed to reply to 20th roll");
                console.error(error);
            }
            
            await DatabaseAPI.diceStatsUpdate(
                {
                    id: this.interaction.user.id,
                    username: this.interaction.user.username,
                    discriminator: this.interaction.user.discriminator,
                    avatarURL: this.interaction.user.avatarURL() ?? ''
                },
                Versions.v20,
                this.statsResult,
                false
            );
        }
        if (this.followUp)
        {
            try
            {
                await this.interaction.followUp(this.followUp);
            }   
            catch(error)
            {
                console.error("Failed to follow up to 20th roll");
                console.error(error);
            }
        }       
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.character = undefined;
        this.response = undefined;
        this.followUp = undefined;
    }
}