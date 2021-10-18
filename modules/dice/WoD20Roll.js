'use strict';

const Roll = require('./Roll.js');
const Discord = require('discord.js');

module.exports = class WoD20Roll
{
    constructor(message)
    {
        this.parsed;
        this.message = message;
        this.error;
        this.cancelOnes;
    }

    parseContent(content)
    {
        let parsed = 
        {
            results: {}, total: 0, spec: false, reason: '', botch: false
        };    

        let breakdown = content.match(
            /\d+\s*@\s*\d+(\s*(\+|-)\s*\d+)*(\s*(\+\s*)?(s|x)(\s*(\+\s*)?(?!\5)(s|x))?(\s+|$))?/i)[0];
        
        parsed.roll = breakdown;
        parsed.reason = content.replace(breakdown, '');
        let difficulty = breakdown.match(/(\s*@\s*\d+\s*)/i)[0];
        breakdown = breakdown.replace(difficulty, '');
        parsed.diff = difficulty.match(/\d+/)[0];
        
        // Sanity checks
        if (parsed.diff > 10 || parsed.diff <= 0)
        {
            this.error =  DIFF_ERR;
            return;
        }

        let spec = breakdown.match(/(\s*(\+\s*)?(spec|s))/i);    
        if (spec)
        { 
            parsed.spec = true;
            breakdown = breakdown.replace(spec[0], '');
        }

        let cancelOnes = breakdown.match(/(\s*(\+\s*)?(x))/i);
        if (cancelOnes)
        {
            this.cancelOnes = true;
            breakdown = breakdown.replace(cancelOnes[0], '');
        }

        let multipleFlags = breakdown.match(/(\s*(\+\s*)?(spec|x|s))/i);
        if (multipleFlags)
        {
            this.multipleFlags = true;
            breakdown = breakdown.replace(multipleFlags[0], '');
        }

        let pool = breakdown.match(/^\d+/i)[0];
        breakdown = breakdown.replace(pool, '');

        if (pool > 50 || pool < 1)
        {
            this.error = AMT_ERR;
            return; 
        }

        parsed.breakdown = breakdown;
        parsed.pool = pool;   
        this.parsed = parsed;
        return; 
    }

    roll()
    {
        if (this.error) return;
        let parsed = this.parsed;
        let breakdown = parsed.breakdown;
        let pool = parsed.pool;
        let results = Roll.manySingle(pool, 10);
        let allRolls = {};
        allRolls.Failed = [];
        allRolls.Passed = [];
        let removed = 0;
        let tens = 0;
        for (let result of results['10'])
        {
            if (result == 1)
            {            
                parsed.botch = true;
                allRolls.Failed.push(result);

                if (!this.cancelOnes)
                {
                    removed += 1
                }                
            }
            else if (parsed.spec && result == 10)
            {
                tens += 1;
                parsed.total += 2;
                allRolls.Passed.push(result);
            }
            else if (result < parsed.diff)
            {
                allRolls.Failed.push(result);
            }
            else
            {
                parsed.total += 1;
                allRolls.Passed.push(result);
            }
        }
    
        // Removed 10s correctly
        let quantity = allRolls.Passed.length - tens; 
        for (removed; removed != 0; removed--)
        {
    
            if (quantity)
            { 
                parsed.total -= 1;
                quantity -= 1;
            }
            else if (tens)
            {
                parsed.total -= 2;
                tens -= 1;
            }
            else
            {
                break;
            }
        }
    
        if (eval(breakdown) > 1000)
        {
            this.error = MOD_ERR;
            return;
        }
    
        if (breakdown.match(/\d+/))
        {
            parsed.modifier = eval(breakdown);
            parsed.total += parsed.modifier;
        } 
        if (parsed.total < 0) parsed.total = 0;
        parsed.results = allRolls;
        this.parsed = parsed;
        return;
    }

    constructEmbed()
    {
        if (this.error) return this.getErrorMessage(this.error);
        let results = this.parsed;
        let message = this.message;
        // Create the embed
        let embed = new Discord.MessageEmbed();        
        if (message.member)
        {
            embed.setAuthor(message.member.displayName, 
                message.author.avatarURL());
        }
        else
        {
            embed.setAuthor(message.author.username, 
                message.author.avatarURL());
        }

        let title = `Rolled | Pool ${results.pool} | Diff ${results.diff}`;
        if (results.modifier) title += ` | Modifier ${results.modifier}`;
        if (results.spec) title += ` | Spec`;
        if (this.cancelOnes) title += ` | Normal Ones`;
        embed.setTitle(title);

        Object.entries(results.results).forEach((entry) =>
        {
            const [key, value] = entry;
            let mess = '';
            if (key == 'Passed') mess += '```diff\n+ ';
            else if (key == 'Failed') mess += '```diff\n- ';
            for (let result of value)
            {
                if (result == 1 && !this.cancelOnes)
                {
                    mess += '️☠️ ';
                }
                else if (result == 10 && results.spec)
                {
                    mess += '🏆 '
                }
                else
                {
                    mess += `${result.toString()} `;
                }            
            }
            if (key == 'Passed') mess += '+\n```';
            else if (key == 'Failed') mess += '-\n```';
            embed.addField(key, mess, true)
        });

        if (results.spec) embed.addField("Spec", '```✅```', true);
        if (results.modifier > 0) 
        {
            embed.addField("Mod", `\`\`\`diff\n+${results.modifier}\n\`\`\``
                , true);
        }
        else if (results.modifier < 0)
        {
            embed.addField("Mod", `\`\`\`diff\n-` +
                `${results.modifier.toString().match(/\d+/)[0]}\n\`\`\``
                , true);
        }    

        if (!results.results.Passed.length && !results.total && results.botch)
        {
            // Botched the roll
            embed.addField('Result', '```diff\n- Botched\n```');
            embed.setColor([204, 12, 47]);
        }
        else if (!results.total)
        {
            // Failed the roll
            embed.addField('Result', '```fix\nFailed\n```');
            embed.setColor([224, 113, 2]);
        }
        else
        {
            // Passed the roll
            embed.addField('Result', `\`\`\`diff\n+ Rolled: ` +
                `${results.total} suxx\n\`\`\``);
            embed.setColor([17, 255, 0]);
        }

        if (results.reason.match(/\S+/)) 
        {
            embed.addField('Notes', results.reason);
        }
        embed.setURL('https://discord.gg/Za738E6');

        embed.setFooter("This bot is becoming v5 specific on the 27/10.\n" +
            "For more info and links to the 20th edition bot please visit the RoD Server.\n" +
            "Please add the new bot as soon as possible.")
        return embed;
    }

    getErrorMessage(code)
    {
        let errors = {}

        errors[DIFF_ERR] = `Difficuilty should not be less than 0 or` +
                ` greater than 10`;
        
        errors[AMT_ERR] = 'The number of dice should not be less than 1' +
                ' or greater than 50';
        
        errors[MOD_ERR] = 'Modifer should not be greater than 1000';
        
        return errors[code];
    }

    _filterDupFlags(breakdown)
    {
        if (content.match(/(s)(\s*(\+\s*)?(s))/i))
        {
            breakdown = breakdown.replace
        }
    }
}

const DIFF_ERR = 1;
const AMT_ERR = 2;
const MOD_ERR = 3;