'use strict';
const Roll = require('./Roll.js');
const { MessageEmbed } = require('discord.js');

module.exports = class GeneralRoll
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.args = [
            interaction.options.getString('dice_set_01'),
            interaction.options.getString('dice_set_02'),
            interaction.options.getString('dice_set_03'),
            interaction.options.getString('dice_set_04'),
            interaction.options.getString('dice_set_05'),
        ]
        this.sets = {};
        this.modifier = interaction.options.getInteger('modifier');
        this.diff = interaction.options.getInteger('difficulty');
        this.notes = interaction.options.getString('notes');
        this.embed = [];
    }

    isArgsValid()
    {
        for (const set of this.args)
        {
            if (!set) continue;

            const valid = set.match(/^\s*\d+\s*d\s*\d+\s*$/i);
            if (!valid)
            {
                this.interaction.reply({
                    content: 
                        'The arguments need to be' +
                        ' in the format "(x)d(y)" where (x) is' +
                        ' the number of dice in the set and (y) is the' +
                        ' number of sides on the dice.\nExample: "5d6"' +
                        ' is 5 dice with six sides each.',
                    ephemeral: true});
                return false;
            }

            let match = valid[0];
            const dice = parseInt(match.match(/\d+/)[0]);
            match = match.replace(/\d+/, '');
            const sides = parseInt(match.match(/\d+/)[0]);

            if (dice > 50 || sides > 500)
            {
                this.interaction.reply({
                    content: 
                        'The number of Dice cannot be more then 50.\n' +
                        'The number of Dice Sides cannot be more than 500.',
                    ephemeral: true});
                return false;
            }

            if (this.sets[sides])
            {
                this.sets[sides].dice += dice;
            }
            else
            {
                this.sets[sides] = {sides: sides, dice: dice};
            }
        }
        return true;
    }

    roll()
    {
        let total = 0;
        for (const key of Object.keys(this.sets))
        {
            const set = this.sets[key];
            set['results'] = Roll.manySingle(set.dice, set.sides);
            total += set.results.total;
        }
        if (this.modifier) total += this.modifier;
        this.sets['total'] = total;
    }

    contructEmbed()
    {
        let embed = new MessageEmbed();        
        
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
        );

        embed.setTitle(`General Roll`);

        for (const key of Object.keys(this.sets))
        {
            if (key == 'total') continue;
            const set = this.sets[key];

            let mess = "```css\n "
            for (const result of set.results[key])
            {
                mess += `${result.toString()} `;
            }
            mess += '\n```'
            embed.addField(`${set.dice}d${set.sides}`, mess, true);
        }

        if (this.modifier)
        {
            embed.addField("Modifier", `\`\`\`css\n${this.modifier}\n\`\`\``, true);
        }
        
        if (this.diff)
        {
            if (this.sets.total < this.diff)
            {
                // Failed the roll
                const total = this.diff - this.sets.total;
                embed.addField('Result', `Total of ${this.sets.total} vs ` +
                    `diff ${this.diff}\nMissing ${total}\n` +
                    '```diff\n- Failed\n```');
                embed.setColor([205, 14, 14]);
            }
            else
            {
                // Passed the roll
                const total = this.sets.total - this.diff;
                embed.addField('Result', `Total of ${this.sets.total} vs ` +
                    `diff ${this.diff}\nMargin of ${total}\n` +
                    '```diff\n+ Passed\n```');
                embed.setColor([102, 255, 51]);
            }
        }
        else
        {
            // No difficulty
            embed.addField('Result', `Total of ${this.sets.total}`);
            embed.setColor([0,0,0]);
        }
        if (this.notes) embed.setFooter(this.notes);
        embed.setURL('https://discord.gg/Qrty3qKv95');

        this.embed = [embed];
        return embed;
    }

    reply()
    {
        this.interaction.reply({embeds: this.embed});
    }
}