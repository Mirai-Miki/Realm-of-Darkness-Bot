'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc');
const DatabaseAPI = require('../../util/DatabaseAPI');
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
        if (this.character) 
        {
            const name = correctName(this.character);
            if (name.lenght > 50)
            {
                this.interaction.reply({ 
                    content: ('Character name cannot be longer than 50 chars.'), 
                    ephemeral: true 
                });
                return false;
            }
            let char = await DatabaseAPI.getCharacter(name, 
                this.interaction.user.id, this.interaction);
            if (char == 'noChar') char = undefined;
            this.character = {
                name: name, 
                tracked: char,
            };
        }

        if (this.pool < 1 || this.pool > 50)
        {
            this.interaction.reply({ 
                content: ('Your pool must be between 1 and 50.\n' +
                    'Pool is the number of dice you are rolling.'), 
                ephemeral: true 
            });
        }
        else if (this.diff < 2 || this.diff > 10)
        {
            this.interaction.reply({ 
                content: ('Your difficulty must be between 2 and 10.\n' +
                    'Difficulty is the number the dice needs to get or higher' +
                    ' to count as a success'), 
                ephemeral: true 
            });
        }
        else if (this.mod && (this.mod < -50 || this.mod > 50))
        {
            this.interaction.reply({ 
                content: ('Your modifier must be between -50 and 50.\n' +
                    'Modifier will either grant a number of success or remove' +
                    ' them. Generally used for Willpower.'), 
                ephemeral: true 
            });
        }
        else if (this.willpower && 
            this.character?.tracked?.willpower.current == 0)
        {
            const resp = character20thEmbed(
                this.character.tracked, this.interaction.client);
            resp['content'] = 'You are currently out of willpower.'
            this.interaction.reply(resp);
        }
        else if (this.nightmare && (this.nightmare > this.pool ||
            this.nightmare < 0))
        {
            this.interaction.reply({ 
                content: ('Nightmare cannot be more then your pool or' +
                    ' less then 0.'), 
                ephemeral: true 
            });
        }
        else return true;
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

        await this.updateCharacter();
        return;
    }

    constructEmbed()
    {
        // Create the embed
        let embed = new MessageEmbed();
        
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
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

        if (this.reason) embed.setFooter(this.reason);
        embed.setURL('https://discord.gg/Qrty3qKv95');
        this.response = { embed: embed };
        return embed;
    }

    constructContent()
    {
        const client = this.interaction.client;
        const botch = client.emojis.resolve('901438266312650772');
        const fail1 = client.emojis.resolve('901438193528881212');
        const fail2 = client.emojis.resolve('901438197882564688');
        const fail3 = client.emojis.resolve('901438198046134282');
        const fail4 = client.emojis.resolve('901438197744152606');
        const fail5 = client.emojis.resolve('901438198213910609');
        const fail6 = client.emojis.resolve('901438198306197504');
        const fail7 = client.emojis.resolve('901438197916123136');
        const fail8 = client.emojis.resolve('901438199358963803');
        const fail9 = client.emojis.resolve('901438198016774176');
        const sux2 = client.emojis.resolve('901438140781326376');
        const sux3 = client.emojis.resolve('901438140487720960');
        const sux4 = client.emojis.resolve('901438140106035320');
        const sux5 = client.emojis.resolve('901438141498544199');
        const sux6 = client.emojis.resolve('901438140257017887');
        const sux7 = client.emojis.resolve('901438141284614144');
        const sux8 = client.emojis.resolve('901438140810682408');
        const sux9 = client.emojis.resolve('901438141938941992');
        const sux10 = client.emojis.resolve('901438140919709716');
        const crit = client.emojis.resolve('901726422513614898');
        const nightmare = client.emojis.resolve('901432906227007488');
        const seperator = client.emojis.resolve('953616399799037982');

        const store = {
            1: {fail: fail1},
            2: {fail: fail2, sux: sux2},
            3: {fail: fail3, sux: sux3},
            4: {fail: fail4, sux: sux4},
            5: {fail: fail5, sux: sux5},
            6: {fail: fail6, sux: sux6},
            7: {fail: fail7, sux: sux7},
            8: {fail: fail8, sux: sux8},
            9: {fail: fail9, sux: sux9},
        }
        
        let mess = '';
        for (const dice of this.results.rolls)
        {
            if (dice == 10)
            {
                if (this.spec) mess += crit.toString();
                else mess += sux10.toString();
            }
            else if (dice >= this.diff) mess += store[dice].sux.toString();
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
                mess += store[dice].fail.toString();
            else mess += botch.toString();
            mess += ' ';
        }

        if (mess.length && this.nightmare) mess += seperator.toString();
        for (const dice of this.results.nightmareDice)
        {
            if (dice == 10)
            {
                mess += nightmare.toString();
            }
            else if (dice >= this.diff) mess += store[dice].sux.toString();
            else if (dice < this.diff && (dice != 1 || this.cancelOnes))
                mess += store[dice].fail.toString();
            else mess += botch.toString();
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

    reply()
    {
        if (this.response)
        {
            this.interaction.reply({ 
                content: this.response.content,  
                embeds: [this.response.embed] 
            });
            DatabaseAPI.diceStatsUpdate(
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
            this.interaction.followUp(this.followUp);
        }       
    }
}