const Roll = require('./Roll.js');
const Discord = require('discord.js');

module.exports = class WoD20Roll
{
    constructor(message)
    {
        this.parsed;
        this.message = message;
        this.error;
        this.modifier = 0;
    }

    parseContent(content)
    {
        let parsed = {results: {}, total: 0, reason: '', 
            errorFlag: false, errorCode: 0};

        let breakdown = content.match(/\d+/i)[0];

        parsed.roll = breakdown;
        this.modifier = parseInt(breakdown);

        if (this.modifier < 1 || this.modifier > 100) 
            return this.error = MOD_ERR;

        let reason = content.replace(breakdown, '');
        parsed.reason = reason;    

        this.parsed = parsed;
        return;
    }

    roll()
    {
        if (this.error) return;
        let parsed = this.parsed;
        let allRolls = {};
        let result = Roll.manySingle(1, 10);
        allRolls['10'] = result['10'];
        
        parsed.results = allRolls;
        parsed.total = this.modifier + result.total;
        this.parsed = parsed;
        return;
    }

    constructEmbed()
    {
        if (this.error) return this.getErrorMessage(this.error);
        let message = this.message;
        let results = this.parsed;
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
        embed.setTitle(`V20 Initiative | (Dex + Wits) = ${results.roll}`);
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

        embed.addField('Result', `Initiative of ${results.total.toString()}`);
        embed.setColor([255,0,0]);
        embed.setURL('https://discord.gg/Za738E6');

        if (results.reason.match(/\S+/)) 
        {
            embed.addField('Notes', results.reason);
        }

        return embed;
    }

    getErrorMessage(code)
    {
        let errors = {}

        errors[MOD_ERR] = `Modifier should not be less than 1 or ` +
            `greater than 100`;

        return errors[code];
    }
}

const MOD_ERR = 1;