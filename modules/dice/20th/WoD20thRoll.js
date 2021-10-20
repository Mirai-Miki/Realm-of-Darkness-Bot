'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc');
const DatabaseAPI = require('../../util/DatabaseAPI')
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
        else return true;
        return false;
    }

    async roll()
    {
        const results = Roll.manySingle(this.pool, 10);
        this.results = {
            rolls: [], 
            failed: [], 
            passed: [], 
            total: 0, 
            botch: false
        }
        let removed = 0;
        let tens = 0;
        
        for (let result of results['10'])
        {
            this.results.rolls.push(result);

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
        if (this.willpower) title += ` | WP`;
        if (this.mod) title += ` | Mod ${this.mod}`;
        if (this.spec) title += ` | Spec`;
        if (this.cancelOnes) title += ` | No Botch`;
        embed.setTitle(title);

        const sortedResults = this.results.rolls.map((x) => x);
        sortedResults.sort((a, b) => b - a);
        
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
        
        embed.addField("Dice", mess.join(", "), true)

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
        embed.setURL('https://discord.gg/Za738E6');
        this.response = { embed: embed };
        return embed;
    }

    constructContent()
    {
        const client = this.interaction.client;
        const botch = client.emojis.resolve('886258888813469766');
        const fail1 = client.emojis.resolve('886257732028596315');
        const fail2 = client.emojis.resolve('886257745743999066');
        const fail3 = client.emojis.resolve('886257759794888726');
        const fail4 = client.emojis.resolve('886257774168797254');
        const fail5 = client.emojis.resolve('886257791587741807');
        const fail6 = client.emojis.resolve('886257808964734997');
        const fail7 = client.emojis.resolve('886257824148107304');
        const fail8 = client.emojis.resolve('886257842657579018');
        const fail9 = client.emojis.resolve('886257860227514380');
        const sux2 = client.emojis.resolve('886257880372752394');
        const sux3 = client.emojis.resolve('886257915059654717');
        const sux4 = client.emojis.resolve('886257935431368754');
        const sux5 = client.emojis.resolve('886257951428452422');
        const sux6 = client.emojis.resolve('886257965567471626');
        const sux7 = client.emojis.resolve('886257979769368627');
        const sux8 = client.emojis.resolve('886258001713971240');
        const sux9 = client.emojis.resolve('886258017614561361');
        const sux10 = client.emojis.resolve('886258032709865492');
        const crit = client.emojis.resolve('900379214715449475');

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