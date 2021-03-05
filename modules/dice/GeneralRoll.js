const Roll = require('./Roll.js');
const Discord = require('discord.js');

module.exports = class GeneralRoll
{
    constructor(message)
    {
        this.parsed;
        this.message = message;
        this.error;
    }

    parseContent(content)
    {
        let parsed = {results: {}, total: 0, reason: '', 
            errorFlag: false, errorCode: 0};    

        let breakdown = content.match(
            /(\d+d\d+)(\s*(\+|-|\*|\/)\s*((\d+d\d+)|(\d+)))*(\s*@\s*\d+)?/i)[0];


        parsed.roll = breakdown;
        parsed.reason = content.replace(breakdown, '');
        let difficulty = breakdown.match(/(\s*@\s*\d+)/i);
        if (difficulty)
        {
            breakdown = breakdown.replace(difficulty[0], '');
            parsed.diff = difficulty[0].match(/\d+/i)[0];
        }

        parsed.DiceQueue = breakdown;
        this.parsed = parsed;
        return;
    }

    roll()
    {
        if (this.error) return;
        let parsed = this.parsed;
        let DiceQueue = parsed.DiceQueue;
        let count = {}
        let allRolls = {};
        while (DiceQueue.match(/\d+d\d+/i))
        {        
            let diceList = DiceQueue.match(/\d+d\d+/i);
            let diceSides = diceList[0].match(/\d+$/i)[0];
            let quantity = diceList[0].match(/^\d+/i)[0];

            if (diceSides < 1 || diceSides > 1000)
            {
                // incorrect usage
                this.error = SIDE_ERR;
                return;
            }
            else if (quantity < 1 || quantity > 50)
            {
                // incorrect usage
                this.error = QNTY_ERR;
                return;
            }

            let results = Roll.manySingle(quantity, diceSides);
            DiceQueue = DiceQueue.replace(diceList[0], results.total.toString());

            if (allRolls[diceSides.toString()])
            {  
                // Making sure there is not more then one of the same type of dice
                // being rolled 
                if (!count[diceSides.toString()])
                {
                    count[diceSides.toString()] = 2;
                }
                else 
                {
                    count[diceSides.toString()] += 1;
                }

                allRolls[`${diceSides.toString()} (${count[diceSides.toString()]})`] 
                    = results[diceSides.toString()];
            }
            else
            {
                allRolls[diceSides.toString()] = results[diceSides.toString()];
            }        
        }

        parsed.results = allRolls;
        parsed.total = eval(DiceQueue);
        if (parsed.total > 9999999) return this.error = TOTL_ERR;
        parsed.DiceQueue = undefined;
        this.parsed = parsed;
        return;
    }

    contructEmbed()
    {
        if (this.error) return this.getErrorMessage(this.error);
        let message = this.message;
        let results = this.parsed;
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
        embed.setTitle(`Rolled | ${results.roll}`);
        Object.entries(results.results).forEach((entry) =>
        {
            const [key, value] = entry;
            let mess = "```css\n "
            for (let result of value)
            {
                mess += `${result.toString()} `;
            }
            mess += '\n```'
            embed.addField(`d${key.toString()}`, mess, true)
        });
        if (results.diff)
        {
            if (results.total < results.diff)
            {
                // Failed the roll
                let total = results.diff - results.total;
                embed.addField('Result', `Total of ${results.total.toString()}\n`
                    + `Missing ${total}\n` +
                    '```diff\n- Failed\n```');
                embed.setColor([205, 14, 14]);
            }
            else
            {
                // Passed the roll
                let total = results.total - results.diff;
                embed.addField('Result', `Total of ${results.total.toString()}\n`
                    + `Margin of ${total}\n` +
                    '```diff\n+ Passed\n```');
                embed.setColor([102, 255, 51]);
            }
        }
        else
        {
            // No difficulty
            embed.addField('Result', `Total of ${results.total.toString()}`);
            embed.setColor([0,0,0]);
        }
        if (results.reason.match(/\S+/)) 
        {
            embed.addField('Notes', results.reason);
        }
        embed.setURL('https://discord.gg/Za738E6');
        return embed;
    }

    getErrorMessage(code)
    {
        let errors = {};
        errors[SIDE_ERR] = 
                `DiceSides should not be less then 1 or greater than 1000`;

        errors[QNTY_ERR] = 
                'The number of dice should not be less than 1' +
                ' or greater than 50';

        errors[TOTL_ERR] =
                'You numbers are too powerful! Try keeping things a ' +
                'little more simple.';
                
        return errors[code];
    }
}

const SIDE_ERR = 'SIDE_ERR';
const QNTY_ERR = 'QNTY_ERR';
const TOTL_ERR = 'TOTL_ERR';