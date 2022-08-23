'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CoDRoll
{
    constructor(interaction)
    {
        this.interaction = interaction;        
        this.response = {};               

        this.pool = this.interaction.options.getInteger('pool');
        this.bonus = this.interaction.options.getInteger('bonus');
        this.penalty = this.interaction.options.getInteger('penalty');
        this.spec = this.interaction.options.getString('speciality');
        this.willpower = this.interaction.options.getBoolean('willpower');
        this.rote = this.interaction.options.getBoolean('rote');
        this.target = this.interaction.options.getInteger('target');
        this.reroll = this.interaction.options.getInteger('reroll');
        this.character = this.interaction.options.getString('character');        
        this.notes = this.interaction.options.getString('notes');
        
        this.chance = false;
    }

    async roll()
    {
        let pool = this.pool + (this.bonus ?? 0);
        if (this.willpower) pool += 3;
        if (this.spec) pool += 1;
        pool -= this.penalty ?? 0;
        
        if (pool <= 0)
        {
            pool = 1;
            this.chance = true;
        }
        
        const results = Roll.manySingle(pool, 10);
        this.results = {
            rolls: results['10'], 
            failed: [], 
            passed: [],
            rote: [],
            rotePassed: [],
            roteFailed: [],
            rerolls: [],
            rerollPassed: [],
            rerollFailed: [],
            total: 0, 
            result: ''
        }
        let rerollPool = 0;
        let rotePool = 0;
        let botch = false;
        
        for (let result of results['10'])
        {
            if (this.chance && result == 10)
            {
                this.results.passed.push(result);
                this.results.total = 1;
            }
            else if (this.chance && result == 1)
            {
                this.results.failed.push(result);
                botch = true;
            }
            else if (result >= (this.reroll ?? 10) && !this.chance)
            {
                rerollPool++;
                if (result >= (this.target ?? 8))
                {
                    this.results.passed.push(result);
                    this.results.total++;
                }
                else
                {
                    this.results.failed.push(result);
                }                
            }
            else if (result >= (this.target ?? 8) && !this.chance)
            {
                this.results.passed.push(result);
                this.results.total++
            }
            else if (this.rote)
            {
                this.results.failed.push(result);
                rotePool++;
            }
            else
            {
                this.results.failed.push(result);
            }
        }

        // Handle Rote rerolls
        this.results.rote = Roll.manySingle(rotePool, 10)['10'];
        for (const result of this.results.rote)
        {
            if (result >= (this.reroll ?? 10) && !this.chance)
            {
                // we add to the reroll pool only if not a chance die
                rerollPool++;
            }
            
            if (this.chance && result === 10)
            {
                this.results.rotePassed.push(result);
                this.results.total++;
            }
            if (!this.chance && result >= (this.target ?? 8))
            {
                this.results.rotePassed.push(result);
                this.results.total++;
            }
            else this.results.roteFailed.push(result);
        }

        // Handle rerolls
        while (rerollPool > 0)
        {
            const dice = Roll.single(10);
            this.results.rerolls.push(dice);
            let rerollAgain = false;

            if (dice >= (this.reroll ?? 10))
            {
                // we need to reroll again
                rerollAgain = true;
            }
            
            if (dice >= (this.target ?? 8))
            {
                this.results.rerollPassed.push(dice);
                this.results.total++;
                if (!rerollAgain) rerollPool--;
            }
            else 
            {
                this.results.rerollFailed.push(dice);
                if (!rerollAgain) rerollPool--;
            }
        }

        if (this.chance && botch) this.results.result = 'botch';
        else if (this.results.total >= 5) this.results.result = "crit";
        else if (this.results.total > 0) this.results.result = "passed";
        else this.results.result = 'failed';

        return;
    }

    async constructEmbed()
    {
        // Create the embed
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

        let title = `Pool ${this.pool}`;
        if (this.bonus) title += ` | Bonus ${this.bonus}`
        if (this.penalty) title += ` | Penalty ${this.penalty}`
        if (this.willpower) title += ` | WP`;
        if (this.spec) title += ` | Spec`;
        if (this.rote) title += ` | Rote`;
        if (this.reroll) title += ` | Reroll ${this.reroll}`;
        if (this.target) title += ` | Target ${this.target}`;
        embed.setTitle(title);

        if (this.character)
        {
            embed.addField("Character", this.character);
        }        
        
        const mess = this.sortDiceResults(this.results.rolls, this.chance);
        const rote = this.sortDiceResults(this.results.rote);
        const reroll = this.sortDiceResults(this.results.rerolls);
        
        if (mess.length) embed.addField(`${this.chance ? "Chance Dice" : "Dice"}`, 
            mess.join(", "), true);
        if (rote.length) embed.addField("Rote Dice", rote.join(", "), true);
        if (reroll.length) embed.addField("Reroll Dice", reroll.join(", "), true);

        if (this.spec) embed.addField("Specialty", `${this.spec}`, false);
        if (this.notes) embed.addField("Notes", this.notes);

        if (this.results.result === 'botch')
        {
            // Botched the roll
            embed.addField('Result', '```diff\n- Dramatic Failure\n```');
            embed.setColor([204, 12, 47]);
            this.statsResult = 'botched';
        }
        else if (this.results.result === 'failed')
        {
            // Failed the roll
            embed.addField('Result', '```fix\nFailed\n```');
            embed.setColor([224, 113, 2]);
            this.statsResult = 'failed';
        }
        else if (this.results.result === 'crit')
        {
            // Exceptional Success
            embed.addField('Result', '```cs\n\' ' +
                `${this.results.total} Exceptional Success \'\n\`\`\``);
            embed.setColor([102, 255, 204]);
            this.statsResult = 'crit';
        }
        else
        {
            // Passed the roll
            embed.addField('Result', `\`\`\`diff\n+ ` +
                `${this.results.total} Success +\n\`\`\``);
            embed.setColor([50, 168, 82]);
            this.statsResult = 'passed';
        }

        const links = "\n[Website](https://realmofdarkness.app/)" +
            " | [Commands](https://realmofdarkness.app/cod/commands/)" +
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
        embed.fields.at(-1).value += links;
        
        embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
        this.response = { embeds: [embed] };
        return embed;
    }

    sortDiceResults(diceResults, chance=false)
    {
        const sortedResults = diceResults.map((x) => x);
        sortedResults.sort((a, b) => b - a);

        const results = [];
        for (let dice of sortedResults)
        {           
            if (dice >= (this.reroll ?? 10) && dice >= (this.target ?? 8)) 
                results.push(`**${dice}**`);            
            else if (dice >= (this.target ?? 8)) results.push(`${dice}`);
            else if (dice >= (this.reroll ?? 10) && dice < (this.target ?? 8)) 
                results.push(`**~~${dice}~~**`);
            else if (chance && dice == 1) results.push(`**~~1~~**`);
            else results.push(`~~${dice}~~`);            
        }
        return results;
    }

    async constructContent()
    {
        let client = this.interaction.client;
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
            10: {sux: client.emojis.resolve('901438140919709716').toString()},
            roteSep: client.emojis.resolve('814396574092361750').toString(),
            rerollSep: client.emojis.resolve('901323344450818109').toString(),
            crit: client.emojis.resolve('901726422513614898').toString()
        }
        client = undefined;
        
        let mess = this.toDiceString(this.results.rolls, emotes, true);
        if (this.results.rote.length)
        {
            mess += emotes.roteSep;
            mess += this.toDiceString(this.results.rote, emotes);
        }
        if (this.results.rerolls.length)
        {
            mess += emotes.rerollSep;
            mess += this.toDiceString(this.results.rerolls, emotes);
        }
        if (mess.length < 2000) this.response.content = mess;
        else this.response.content = undefined;
        return mess;
    }

    toDiceString(diceResults, emotes, chanceDice=false)
    {
        let mess = ''
        for (const dice of diceResults)
        {
            if (this.chance)
            {
                if (dice == 10) mess += emotes.crit;
                else if (dice == 1 && chanceDice) mess += emotes.botch; 
                else mess += emotes[dice].fail; 
            }
            else
            {
                if (dice >= (this.reroll ?? 10)) mess += emotes.crit;                       
                else if (dice >= (this.target ?? 8)) mess += emotes[dice].sux;
                else mess += emotes[dice].fail;
            }            
            mess += ' ';
        }
        return mess;
    }

    async reply()
    {
        if (this.response)
        {
            try
            {
                await this.interaction.editReply({ 
                    content: this.response.content,  
                    embeds: this.response.embeds 
                });
            }
            catch(error)
            {
                console.error("Failed to reply to CoD roll");
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