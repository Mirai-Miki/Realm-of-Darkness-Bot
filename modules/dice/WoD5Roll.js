'use strict';

const Roll = require('./Roll.js');
const Discord = require('discord.js');
const Database = require('../util/Database.js');

const Result = 
{
    totalFail: 0,
    bestialFail: 1,
    fail: 2,
    success: 3,
    messyCrit: 4,
    crit: 5,    
}

const POOL_ERR = 1;
const HUNGER_ERR = 2;
const DIFF_ERR = 3;
const HISTORY_ERR = 4;
const REROLL_ERR = 5;
const DICE_MISSING_ERR = 6;
const NOTHING_TO_REROLL = 7;

module.exports = class WoD5Roll
{
    constructor(client, user, member=undefined)
    {
        this.client = client;
        this.user = user;
        this.member;
        this.message;
        this.contest = false;

        this.diceResults;
        this.error;

        this.diff = 0;
        this.pool;
        this.hunger;

        this.reroll = {};
        this.surge;
        this.notes;

        this.total = 0,     
        this.result;

        if (member)
        {
            this.member = member;
            this.user.username = member.displayName;
        }
    }

    parseContent(content)
    {
        let breakdown = content.match(/\s*\d+(\s+\d+(\s+\d+)?)?/i)[0];
        this.notes = content.replace(breakdown, '');
        this.notes = this.notes.trim();

        // Extract args
        while (breakdown.match(/\s*\d+/i))
        {
            let temp = breakdown.match(/\s*\d+/i)[0]
            if (this.pool === undefined)
            {
                this.pool = parseInt(temp);
            }
            else if (this.hunger === undefined)
            {
                this.hunger = parseInt(temp);
            }
            else
            {
                this.diff = parseInt(temp);
            }
            breakdown = breakdown.replace(temp, '');
        }

        if (this.hunger === undefined) this.hunger = 0;

        // Sanity checks
        if (this.pool < 1 || this.pool > 50)
        {
            this.error = POOL_ERR;
            return;
        }
        else if (this.hunger < 0 || this.hunger > 5)
        {
            this.error = HUNGER_ERR;
            return;
        }
        else if (this.diff < 0 || this.diff > 50)
        {
            this.error = DIFF_ERR;
            return;
        }
    }

    parseReroll(content)
    {
        if (this.error) return;
        this.reroll.queue = 0;
        let breakdown = content.match
        (/^\s*(\d+|f|c|s|p|fail|crit|sux)(\s+(\d+|f|c|s|p|fail|crit|sux)(\s+(\d+|f|c|s|p|fail|crit|sux))?)?(\s+|$)/i)[0];
        this.reroll.notes = content.replace(breakdown, '');
        this.reroll.notes = this.reroll.notes.trim();

        // Extract args
        this.reroll.dice = {};
        while (breakdown.match(/\s*(\d+|f|c|s|p|fail|crit|sux)/i))
        {   
            let temp = breakdown.match(/(\d+|f|c|s|p|fail|crit|sux)/i)[0]
            this.reroll.dice[this.reroll.queue] = temp;
            
            if (parseInt(temp) && (parseInt(temp) < 1 || parseInt(temp) > 10))
            {
                this.error = REROLL_ERR;
                return;
            }
            breakdown = breakdown.replace(temp, '');
            this.reroll.queue++;
        }
    }

    quickReroll(content)
    {
        this.reroll.notes = content.trim();
        this.reroll.dice = {};
        this.reroll.quick = true;
        this.reroll.queue = 3;
    }

    roll()
    {
        if (this.error) return;
        this.diceResults = Roll.v5(this.pool, this.hunger);
        this.reroll.rrCount = 0;
    }

    addSurge(amount, bp)
    {   
        let rouse;
        if (Math.floor(Math.random() * 2)) rouse = false;
        else rouse = true;
        
        this.surge = {rouse: rouse, pool: amount, bp: bp};
        this.pool += amount;
    }

    setDifficulty(amount)
    {
        this.diff = amount;
    }

    rerollDice()
    {
        if (this.error) return;
        
        let hungerResults = [];
        let regResults = [];
        let count = 0;
        this.reroll.rrCount++;

        for (let result of this.diceResults)
        {
            if (result.diceType == 'v5h') hungerResults.push(result);
            else if (count == this.reroll.queue)
            {
                regResults.push(result);
            }
            else if (this.reroll.quick && result.result < 6)
            {
                regResults.push(Roll.v5(1, 0)[0]);
                count++
            }
            else if (this.reroll.dice[0] || this.reroll.dice[1] || 
                this.reroll.dice[2])
            {
                let hit = false;
                for (const [key, value] of Object.entries(this.reroll.dice))
                {
                    if ((parseInt(value) && parseInt(value) == result.result) ||
                        (value.match(/f|fail/i) && result.result < 6) ||
                        (value.match(/c|crit/i) && result.result == 10) ||
                        (value.match(/p|s|sux/i) && result.result >= 6 && 
                        result.result < 10))
                    {
                        delete this.reroll.dice[key];
                        regResults.push(Roll.v5(1, 0)[0]);
                        count++;
                        hit = true;
                        break;
                    }
                }
                if (!hit) regResults.push(result);
            }
            else
            {
                regResults.push(result);
            }          
        }
        
        // Make sure we have removed all the dice we are going to reroll
        if (!this.reroll.quick && count != this.reroll.queue) 
            return this.error = DICE_MISSING_ERR;
        
        if (count == 0) this.reroll.queue = 0;
        this.diceResults = regResults.concat(hungerResults);
        
        if (this.reroll.rrCount && !this.reroll.queue)
            this.error = NOTHING_TO_REROLL;
    }

    networkRoll()
    {
        this.calculateResults();
    }    

    constructEmbed()
    {
        this.calculateResults();
        // Init Emojis
        this.v5SkullRed = this.client.emojis.resolve('814397402185728001');
        this.v5AnkhRed = this.client.emojis.resolve('814396441828392982');
        this.v5AnkhCritRed = this.client.emojis.resolve('814395210678927370');
        this.v5AnkhBlack = this.client.emojis.resolve('814396636793012254');
        this.v5AnkhCritBlack = this.client.emojis.resolve('814396519574143006');
        this.v5DotRed = this.client.emojis.resolve('814396574092361750');
        this.v5DotBlack = this.client.emojis.resolve('901323344450818109');

        if (this.error) return this._getErrorMessage(this.error);
        let total = this.total;
        let diff = this.diff;
        let pool = this.pool;
        let hunger = this.hunger;

        let message = "";
        let resultMessage = "";
        let blackResult = "```diff\n+ ";
        let hungerResult = "```diff\n- ";
        let color = [0, 0 , 0]; // Black

        // Result Loop
        for (let result of this.diceResults) 
        {
            // Adding each dice emoji to the start of the message
            if (result.result == 1)
            {
                if (result.diceType == 'v5b')
                {
                    message += this.v5DotBlack.toString();
                }
                else
                {
                    message += this.v5SkullRed.toString();
                }
            }
            else if (result.result <= 5)
            {
                if (result.diceType == 'v5b')
                {
                    message += this.v5DotBlack.toString();
                }
                else
                {
                    message += this.v5DotRed.toString();
                }
            }
            else if (result.result <= 9)
            {
                if (result.diceType == 'v5b')
                {
                    message += this.v5AnkhBlack.toString();
                }
                else
                {
                    message += this.v5AnkhRed.toString();
                }
            }
            else
            {
                if (result.diceType == 'v5b')
                {
                    message += this.v5AnkhCritBlack.toString();
                }
                else
                {
                    message += this.v5AnkhCritRed.toString();

                }
            }

            // Adding the dice results to the dice fields
            if (result.diceType == 'v5b')
            {
                blackResult += `${result.result} `;
            }
            else 
            {
                hungerResult += `${result.result} `;
            }      
        }

        // Adding last sentance to Result Message
        // And picking colors
        if (this.result == Result.bestialFail)
        {
            resultMessage += '\n```diff\n- Bestial Failure -\n```';
            color = [205, 14, 14]; // Blood Red
        }
        else if (this.result == Result.totalFail)
        {
            resultMessage += '\n```fix\n Total Failure \n```';
            color = [255, 204, 0]; // Yellow
        }
        else if (this.result == Result.fail)
        {
            resultMessage += '\n```fix\n Failed \n```';
            color = [224, 113, 2]; // Black
        }
        else if (this.result == Result.messyCrit)
        {
            resultMessage += '\n```diff\n- Messy Critical -\n```';
            color = [255, 0, 102]; // Bright Red
        }
        else if (this.result == Result.crit)
        {
            resultMessage += '\n```cs\n\' Critical \'\n```';
            color = [102, 255, 204]; // Auqa
        }
        else
        {
            resultMessage += '\n```diff\n+ Success +\n```';
            color = [102, 255, 51]; // Green
        }

        // Total and diff added to Result Message
        if (!diff) resultMessage += `Rolled: ${total} suxx`;
        if (diff)
        {
            resultMessage += `${total} suxx`;
            resultMessage += ` vs diff ${diff}`;
        }

        // Adding Margin to Result Message
        if (diff && total > diff)
        {
            resultMessage += `\nMargin of ${total - diff}`;
        }
        else if (diff && total < diff)
        {
            resultMessage += `\nMissing ${diff - total}`;
        }

        // End the messages
        blackResult += '+\n```';
        hungerResult += '-\n```';

        if (pool == hunger)
        {
            blackResult = '```\n ```';
        }
        else if (!hunger)
        {
            hungerResult = '```\n ```';
        }

        // Create Title
        let title = `Rolled | Pool ${pool}`;
        if (this.hunger) title += ` | Hunger ${hunger}`;
        if (this.diff) title += ` | Difficulty ${diff}`;

        // Create the embed
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(this.user.username, this.user.avatarURL())
        .setTitle(title)
        .addField("Result", resultMessage, true)
        .addField("Dice", blackResult, true)
        .setColor(color)
        .setURL('https://discord.gg/Za738E6');

        if (this.hunger) embed.addField("Hunger", hungerResult, true);

        // Finishing touches
        let description = '';
        if (this.reroll.rrCount) description = '<† Willpower Reroll †>'
        if (this.surge)
        {
            description += ` <† Surged †>`;

            let rouse;
            if (this.surge.rouse) rouse = ' <† Rouse Passed †>';
            else rouse = ' **<† Hunger Increased †>**'
            description += rouse;
        }

        if (this.reroll.rrCount > 1) description += 
            `ﾠ**Reroll Attempts: ${this.reroll.rrCount}**`;
        if (description) embed.setDescription(description);
        if (this.notes) embed.addField("Notes", this.notes);
        if (this.reroll.notes) embed.addField("Reroll Notes", this.reroll.notes);

        embed.setFooter("All commands are being replaced by Slash Commands on the 27/10.\n" +
            "For more info please visit the RoD Server.")

        // Send it all back            
        return {'message': message, 'embed': embed};
    }

    serialize()
    {
        if (this.error) return;
        
        let db = new Database();
        db.open('v5RollHisotry', 'Database');

        let roll = 
        {
            pool: this.pool,
            hunger: this.hunger,
            diff: this.diff,
            diceResults: this.diceResults,
            rrCount: this.reroll.rrCount,
            notes: this.notes,
        };     
        
        let id = this.user.id;
        if (this.member) id += this.member.guild.id;
        db.add(id, roll);
        db.close();
    }

    getSerializedRoll()
    {
        return {
            pool: this.pool,
            hunger: this.hunger,
            diff: this.diff,
            diceResults: this.diceResults,
            rrCount: this.reroll.rrCount,
            surge: this.surge,
            notes: this.notes,
            rrNotes: this.reroll.notes,
            total: this.total,
        };
    }

    deserialize()
    {
        let db = new Database();
        db.open('v5RollHisotry', 'Database');

        let id = this.user.id;
        if (this.member) id += this.member.guild.id;

        let roll = db.find(id);
        if (!roll) return this.error = HISTORY_ERR;

        this.pool = roll.pool;
        this.hunger = roll.hunger;
        this.diff = roll.diff;
        this.diceResults = roll.diceResults;
        this.reroll.rrCount = roll.rrCount;
        this.notes = roll.notes;
    }

    deserializeFromPayload(roll)
    {
        this.pool = roll.pool;
        this.hunger = roll.hunger;
        this.diff = roll.diff;
        this.diceResults = roll.diceResults;
        this.reroll.rrCount = roll.rrCount;
        this.surge = roll.surge;
        this.notes = roll.notes;
        this.reroll.notes = roll.rrNotes;
        this.total = roll.total;
    }

    removeSerializedRoll()
    {
        let db = new Database();
        db.open('v5RollHisotry', 'Database');
        
        let id = this.user.id;
        if (this.member) id += this.member.guild.id;

        db.delete(id);
        db.close();
    }

    calculateResults()
    {
        if (this.error) return;     
        let crit = 0;
        this.total = 0;

        let bestialFail = false;
        let critSuxx = false;
        let messyCrit = false;

        for (let result of this.diceResults)
        {
            if (result.result == 1 && result.diceType == 'v5h')
            {
                bestialFail = true;
            }
            else if (result.result == 10)
            {
                crit += 1;
                this.total += 1;
                if (result.diceType == 'v5h') messyCrit = true;
            }
            else if (result.result >= 6)
            {
                this.total += 1;
            }
        }

        // Calculating how many critals were scored and adding them to the total
        let temp = (crit % 2) ? (crit - 1) : crit;
        if (temp > 0) 
        {
            critSuxx = true;
            this.total += temp;
            
        }

        // Work out the result
        if (this.total < this.diff && bestialFail)
        {
            // Bestial Fail
            this.result = Result.bestialFail;
        }
        else if (this.total == 0)
        {
            // total Fail
            this.result = Result.totalFail;
        }
        else if (this.total < this.diff)
        {
            //fail
            this.result = Result.fail;
        }
        else if (critSuxx && messyCrit)
        {
            // messy crit
            this.result = Result.messyCrit;
        }
        else if (critSuxx)
        {
            // crit
            this.result = Result.crit;
        }
        else
        {
            // success
            this.result = Result.success;
        }
    }

////////////////////////////// Private Helper Functions ///////////////////////
///////////////////////////////////////////////////////////////////////////////
    
    _getErrorMessage(code)
    {
        let errors = {};
        errors[POOL_ERR] = `<@${this.user.id}>, ` +
            `Pool should **not** be less than 1 or` +
            ` larger then 50`;
        
        errors[HUNGER_ERR] = `<@${this.user.id}>, ` +
            'Hunger should **not** be less than ' +
            '0 or greater than 5';
        
        errors[DIFF_ERR] = `<@${this.user.id}>, ` +
            'Difficulty should not be less than 0 or greater ' +
            'than 50';

        errors[HISTORY_ERR] = `<@${this.user.id}>, ` +
            'Sorry I could not find your previous roll. ' +
            'Perhaps you have already rerolled it?';
        
        errors[REROLL_ERR] = `<@${this.user.id}>, ` +
            'Dice cannot be less than 1 or greater than 10.';
        
        errors[DICE_MISSING_ERR] = `<@${this.user.id}>, ` +
            'One of the dice you selected is' +
            ' not one of the previously rolled regular dice.';

        errors[NOTHING_TO_REROLL] = `<@${this.user.id}>, ` +
            'There is nothing to reroll!';

        return errors[code];
    }
}