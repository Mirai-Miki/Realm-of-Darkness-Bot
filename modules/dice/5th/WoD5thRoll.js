'use strict';
const Roll = require('../Roll.js');
const Rouse = require('./Rouse.js');
const { MessageActionRow, MessageSelectMenu, 
    MessageButton, MessageEmbed } = require('discord.js');
const Util = require('../../util/Util.js');


const Result = 
{
    totalFail: 0,
    bestialFail: 1,
    fail: 2,
    success: 3,
    messyCrit: 4,
    crit: 5,    
}

module.exports = class WoD5thRoll
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.results = {roll: {}, total: 0, type: 0, fails: 0};
        this.response = {embed: [], content: '', interactions: []};

        this.pool = this.interaction.options.getInteger('pool');
        this.hunger = this.interaction.options.getInteger('hunger');
        this.diff = this.interaction.options.getInteger('difficulty');
        this.bp = this.interaction.options.getInteger('blood_surge');
        this.spec = this.interaction.options.getString('speciality');
        this.rouse = this.interaction.options.getString('rouse');
        this.notes = this.interaction.options.getString('notes');
        this.totalPool = calculateTotalPool(this.pool, this.bp, this.spec);
    }

    isArgsValid()
    {
        if (this.pool < 1 || this.pool > 50)
        {
            this.interaction.reply({ 
                content: ('Your pool must be between 1 and 50.\n' +
                    'Pool is the number of dice you are rolling.'), 
                ephemeral: true 
            });
        }
        else if (this.hunger && (this.hunger < 0 || this.hunger > 5))
        {
            this.interaction.reply({ 
                content: ('Your hunger must be between 0 and 5.\n' +
                    'Hunger is the amount of hunger dice inclucded in your' +
                    ' pool.'), 
                ephemeral: true 
            });
        }
        else if (this.diff && (this.diff < 1 || this.diff > 10))
        {
            this.interaction.reply({ 
                content: ('Your difficulty must be between 1 and 50.\n' +
                    'Difficulty is the number the dice that landed on a 6+' +
                    ' needed to pass the roll.'), 
                ephemeral: true 
            });
        }
        else if (this.bp && (this.bp < 0 || this.bp > 10))
        {
            this.interaction.reply({ 
                content: ('The number entered is you current Blood Potency' +
                    '. This must be between 0 and 10.'), 
                ephemeral: true 
            });
        }
        else return true;
        return false;
    }

    roll()
    {        
        this.results.roll = Roll.v5(this.totalPool, (this.hunger ?? 0));    
        calculateResults(this.results, (this.diff ?? 1));
    }

    reroll(selected)
    {       
        const reg = [];
        const hunger = [];
        this.rerollCount = 0;
        const values = selected?.map(x => parseInt(x.match(/^\d+/)[0]));

        for (const dice of this.results.roll)
        {
            if (dice.type == 'v5b')
            {
                if ((values && values.includes(dice.result)) || 
                    (!selected && this.rerollCount < 3 && dice.result < 6))
                {
                    if (selected)
                    {
                        const index = values.indexOf(dice.result);
                        if (index > -1) values.splice(index, 1);
                    }
                    this.rerollCount += 1;
                    reg.push(Roll.v5(1, 0)[0]);
                }
                else reg.push(dice);
            }
            else hunger.push(dice);
        } 
        
        this.results.roll = reg.concat(hunger);
        calculateResults(this.results, (this.diff ?? 1));
    }

    constructEmbed()
    {        
        
        let blackResult = [];
        let hungerResult = [];
        
        const client = this.interaction.client;
        const hunger = 
        {
            1: client.emojis.resolve('886257732028596315').toString(),
            2: client.emojis.resolve('886257745743999066').toString(),
            3: client.emojis.resolve('886257759794888726').toString(),
            4: client.emojis.resolve('886257774168797254').toString(),
            5: client.emojis.resolve('886257791587741807').toString(),
            6: client.emojis.resolve('886257808964734997').toString(),
            7: client.emojis.resolve('886257824148107304').toString(),
            8: client.emojis.resolve('886257842657579018').toString(), 
            9: client.emojis.resolve('886257860227514380').toString(),
            10: client.emojis.resolve('886448649075306496').toString(),
        }

        const blackDice = 
        {
            1: client.emojis.resolve('886604474842505217').toString(),
            2: client.emojis.resolve('886257880372752394').toString(),
            3: client.emojis.resolve('886257915059654717').toString(),
            4: client.emojis.resolve('886257935431368754').toString(),
            5: client.emojis.resolve('886257951428452422').toString(),
            6: client.emojis.resolve('886257965567471626').toString(),
            7: client.emojis.resolve('886257979769368627').toString(),
            8: client.emojis.resolve('886258001713971240').toString(), 
            9: client.emojis.resolve('886258017614561361').toString(),
            10: client.emojis.resolve('886258032709865492').toString(),
        }


        // Result Loop
        for (const dice of this.results.roll) 
        {
            // Adding the dice results to the dice fields
            if (dice.type == 'v5b')
            {
                blackResult.push(blackDice[dice.result]);
            }
            else 
            {
                hungerResult.push(hunger[dice.result]);
            }      
        }

        let resultMessage = "";
        let color = [0, 0 , 0]; // Black
        if (this.results.type == Result.bestialFail)
        {
            resultMessage += '\n```diff\n- Bestial Failure -\n```';
            color = [205, 14, 14]; // Blood Red
        }
        else if (this.results.type == Result.totalFail)
        {
            resultMessage += '\n```fix\n Total Failure \n```';
            color = [255, 204, 0]; // Yellow
        }
        else if (this.results.type == Result.fail)
        {
            resultMessage += '\n```fix\n Failed \n```';
            color = [224, 113, 2]; // Black
        }
        else if (this.results.type == Result.messyCrit)
        {
            resultMessage += '\n```diff\n- Messy Critical -\n```';
            color = [255, 0, 102]; // Bright Red
        }
        else if (this.results.type == Result.crit)
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
        if (!this.diff) resultMessage += `Rolled: ${this.results.total} sux`;
        else
        {
            resultMessage += `${this.results.total} sux`;
            resultMessage += ` vs diff ${this.diff}`;
        }

        // Adding Margin to Result Message
        if (this.diff && this.results.total > this.diff)
        {
            resultMessage += `\nMargin of ${this.results.total - this.diff}`;
        }
        else if (this.diff && this.results.total < this.diff)
        {
            resultMessage += `\nMissing ${this.diff - this.results.total}`;
        }

        // Create Title
        let title = `Pool ${this.totalPool}`;
        if (this.hunger) title += ` | Hunger ${this.hunger}`;
        if (this.diff) title += ` | Difficulty ${this.diff}`;
        if (this.bp) title += ' | Surged';
        if (this.spec) title += ' | Spec';

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

        embed.setTitle(title);    
        if (blackResult.length) embed.addField(
            "Dice", `${blackResult.join(' ')}ﾠ`, true);
        if (this.hunger) embed.addField(
            "Hunger", `${hungerResult.join(' ')}ﾠ`, true);
        if (this.spec) embed.addField("Specialty", this.spec);
        embed.addField("Result", `${resultMessage}`);
        embed.setColor(color);
        embed.setURL('https://discord.gg/Za738E6');        

        // Finishing touches
        if (this.rerollCount) 
            embed.setDescription(`<† Rerolled ${this.rerollCount} Dice †>`);

        //if (this.reroll.rrCount > 1) description += 
        //    `ﾠ**Reroll Attempts: ${this.reroll.rrCount}**`;
        if (this.notes) embed.setFooter(this.notes);
        
        this.response.embed = embed;
        return embed;
    }

    constructContent()
    {
        const client = this.interaction.client;
        this.v5SkullRed = client.emojis.resolve('814397402185728001');
        this.v5AnkhRed = client.emojis.resolve('814396441828392982');
        this.v5AnkhCritRed = client.emojis.resolve('814395210678927370');
        this.v5AnkhBlack = client.emojis.resolve('814396636793012254');
        this.v5AnkhCritBlack = client.emojis.resolve('814396519574143006');
        this.v5DotRed = client.emojis.resolve('814396574092361750');
        this.v5DotBlack = client.emojis.resolve('814391880258682881');
        let content = "";
        // Result Loop
        for (let dice of this.results.roll) 
        {
            // Adding each dice emoji to the start of the message
            if (dice.result == 1)
            {
                if (dice.type == 'v5b')
                {
                    content += this.v5DotBlack.toString();
                }
                else
                {
                    content += this.v5SkullRed.toString();
                }
            }
            else if (dice.result <= 5)
            {
                if (dice.type == 'v5b')
                {
                    content += this.v5DotBlack.toString();
                }
                else
                {
                    content += this.v5DotRed.toString();
                }
            }
            else if (dice.result <= 9)
            {
                if (dice.type == 'v5b')
                {
                    content += this.v5AnkhBlack.toString();
                }
                else
                {
                    content += this.v5AnkhRed.toString();
                }
            }
            else
            {
                if (dice.type == 'v5b')
                {
                    content += this.v5AnkhCritBlack.toString();
                }
                else
                {
                    content += this.v5AnkhCritRed.toString();
                }
            }
        }

        this.response.content = content;
        return content;
    }

    constructInteractions()
    {
        const buttonRow = new MessageActionRow()
        if (this.results.fails)
        {
            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId('autoReroll')
                    .setLabel('Auto Reroll')
                    .setStyle('PRIMARY'),
            );
        }

        if (this.totalPool > this.hunger)
        { 
            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId('selectReroll')
                    .setLabel('Select Reroll')
                    .setStyle('SECONDARY'),
            );
        }
        
        if (buttonRow.components.length)
        {
            this.response.interactions.push(buttonRow);
        }
    }

    async reply()
    {
        if (!this.response.embed) return;

        await this.interaction.reply(
        { 
            content: this.response.content,  
            embeds: [this.response.embed],
            components: this.response.interactions,
        });

        if (this.bp)
        {
            const rouse = new Rouse(this.interaction, true);
            rouse.roll();
            rouse.constructEmbed();
            rouse.reply(true);          
        }
        if (this.rouse)
        {
            const rouse = new Rouse(this.interaction);
            rouse.roll();
            rouse.constructEmbed();
            rouse.reply(true);          
        }

        const message = await this.interaction.fetchReply();
        
        this.collector = message.createMessageComponentCollector(
            {
                time: Util.minToMilli(14)
            });
        
        this.collector.on('collect', async i => {
            if (i.user.id === this.interaction.user.id) {
                if (i.customId == 'autoReroll')
                {
                    // reroll
                    this.reroll();
                    this.constructEmbed();
                    this.constructContent();
                    await i.update({ 
                        content: this.response.content,
                        embeds: [this.response.embed],                        
                        components: []
                    });
                    this.collector.stop();
                }
                else if (i.customId == 'selectReroll' && i.isButton())
                {
                    i.update({components: this.createRerollSelect()});
                }
                else if (i.customId == 'selectReroll' && i.isSelectMenu())
                {
                    this.reroll(i.values);
                    this.constructEmbed();
                    this.constructContent();
                    await i.update({ 
                        content: this.response.content,
                        embeds: [this.response.embed],                        
                        components: []
                    });
                    this.collector.stop();
                }
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

        this.collector.on('end', i => {
            this.interaction.editReply({components: []});
        });
    }
    
    createRerollSelect()
    {
        let sortedRolls = this.results.roll.map(x => x);
        sortedRolls.sort((a, b) => a.result - b.result);

        const options = [];
        const count = {};

        for (const dice of sortedRolls)
        {
            if (dice.type === 'v5h') continue;
            
            let description;
            if (dice.result < 6) description = 'Fail';
            else if (dice.result < 10) description = 'Success';
            else description = 'Critical';

            let value;
            if (count[dice.result])
            {
                count[dice.result] += 1;
                value = `${dice.result} (${count[dice.result]})`;
            }
            else
            {
                value = `${dice.result}`;
                count[dice.result] = 1;
            }

            options.push(
            {
                label: `${dice.result}`,
                description: description,
                value: value,
            });

            if (options.length >= 25) break;
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('selectReroll')
                    .setPlaceholder('Select Dice to Reroll')
                    .setMinValues(1)
                    .setMaxValues(options.length < 6 ? options.length : 6)
                    .addOptions(options),
            );
        
        return [row];
    }    
}

function calculateResults(results, diff)
{
    let crit = 0;
    let bestialFail = false;
    let critSuxx = false;
    let messyCrit = false;
    results.total = 0;

    for (const dice of results.roll)
    {
        if (dice.result == 1 && dice.type == 'v5h')
        {
            bestialFail = true;
        }
        else if (dice.result == 10)
        {
            crit += 1;
            results.total += 1;
            if (dice.type == 'v5h') messyCrit = true;
        }
        else if (dice.result >= 6)
        {
            results.total += 1;
        }
        else if (dice.type == 'v5b' && dice.result < 6)
        {
            results.fails += 1;
        }
    }

    // Calculating how many critals were scored and adding them to the total
    let temp = (crit % 2) ? (crit - 1) : crit;
    if (temp > 0) 
    {
        critSuxx = true;
        results.total += temp;
        
    }

    // Work out the result
    if (results.total < diff && bestialFail)
    {
        // Bestial Fail
        results.type = Result.bestialFail;
    }
    else if (results.total == 0)
    {
        // total Fail
        results.type = Result.totalFail;
    }
    else if (results.total < diff)
    {
        //fail
        results.type = Result.fail;
    }
    else if (critSuxx && messyCrit)
    {
        // messy crit
        results.type = Result.messyCrit;
    }
    else if (critSuxx)
    {
        // crit
        results.type = Result.crit;
    }
    else
    {
        // success
        results.type = Result.success;
    }

    return results;
}

function calculateTotalPool(pool, bp, spec)
{
    let surge = 0;

    if (bp)
    {
        switch (bp)
        {
            case 10:
            case 9:
                surge = 6;
                break;
            case 8:
            case 7:
                surge = 5;
                break;
            case 6:
            case 5:
                surge = 4;
                break;
            case 4:
            case 3:
                surge = 3;
                break;
            case 2:
            case 1:
                surge = 2;
                break;
            case 0:
                surge = 1;
        }
    }

    return (pool + surge + (spec ? 1 : 0));
}
