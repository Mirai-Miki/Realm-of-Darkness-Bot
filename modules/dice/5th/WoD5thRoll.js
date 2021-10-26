'use strict';
const Roll = require('../Roll.js');
const { MessageActionRow, MessageSelectMenu, 
    MessageButton, MessageEmbed } = require('discord.js');
const { minToMilli, correctName } = require('../../util/misc.js');
const DatabaseAPI = require('../../util/DatabaseAPI.js');
const { Versions, Splats } = require('../../util/Constants');
const { character5thEmbed } = require('../../Tracker/embed/character5thEmbed');

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
        this.bloodSurge;
        this.rouseRoll;
        this.statsResult;
        this.isReroll = false;

        this.pool = this.interaction.options.getInteger('pool');
        this.hunger = this.interaction.options.getInteger('hunger');
        this.diff = this.interaction.options.getInteger('difficulty');
        this.bp = this.interaction.options.getInteger('blood_surge');
        this.spec = this.interaction.options.getString('speciality');
        this.rouse = this.interaction.options.getString('rouse');
        this.notes = this.interaction.options.getString('notes');
        this.character = this.interaction.options.getString('character');
        this.autoHunger = this.interaction.options.getBoolean('auto_hunger');

        this.totalPool = calculateTotalPool(this.pool, this.bp, this.spec);
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

            if (char && this.autoHunger && char.splat === 'Vampire' && 
                char.version === '5th')
            {
                this.hunger = char.hunger.current;
            }                 
        }

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
        
        // Surging
        if (this.bp != null)
        {
            this.bloodSurge = {
                dice: [Roll.single(10)],
                passed: false,
                description: '- Hunger Increased -'
            };
            if (this.bloodSurge.dice[0] >= 6)
            {
                this.bloodSurge.description = 'Hunger Unchanged';
                this.bloodSurge.passed = true;
            }
        } 
        if (this.rouse)
        {
            this.rouseRoll = {
                dice: [Roll.single(10)],
                passed: false,
                description: '- Hunger Increased -'
            };
            if (this.rouse === 'Reroll') this.rouseRoll.dice.push(Roll.single(10));
            for (const dice of this.rouseRoll?.dice)
            {
                if (dice >= 6)
                {
                    this.rouseRoll.description = 'Hunger Unchanged';
                    this.rouseRoll.passed = true;
                } 
            }
        } 
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
        
        this.isReroll = true;
        this.results.roll = reg.concat(hunger);
        calculateResults(this.results, (this.diff ?? 1));

        this.updateCharacter(0, true);
    }

    constructEmbed()
    {        
        
        let blackResult = [];
        let hungerResult = [];

        // Result Loop
        for (const dice of this.results.roll) 
        {
            // Adding the dice results to the dice fields
            if (dice.type == 'v5b')
            {
                blackResult.push(dice.result);
            }
            else 
            {
                hungerResult.push(dice.result);
            }      
        }

        let resultMessage = "";
        let color = [0, 0 , 0]; // Black
        if (this.results.type == Result.bestialFail)
        {
            this.statsResult = 'bestial_fail';
            resultMessage += '\n```diff\n- Bestial Failure -\n```';
            color = [205, 14, 14]; // Blood Red
        }
        else if (this.results.type == Result.totalFail)
        {
            this.statsResult = 'total_fail';
            resultMessage += '\n```fix\n Total Failure \n```';
            color = [255, 204, 0]; // Yellow
        }
        else if (this.results.type == Result.fail)
        {
            this.statsResult = 'failed';
            resultMessage += '\n```fix\n Failed \n```';
            color = [224, 113, 2]; // Black
        }
        else if (this.results.type == Result.messyCrit)
        {
            this.statsResult = 'messy_critical';
            resultMessage += '\n```diff\n- Messy Critical -\n```';
            color = [255, 0, 102]; // Bright Red
        }
        else if (this.results.type == Result.crit)
        {
            this.statsResult = 'critical';
            resultMessage += '\n```cs\n\' Critical \'\n```';
            color = [102, 255, 204]; // Auqa
        }
        else
        {
            this.statsResult = 'passed';
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
        
        if (this.character)
        {
            embed.addField("Character", this.character.name);
            if (this.character.tracked?.thumbnail) 
                embed.setThumbnail(this.character.tracked.thumbnail)
        }

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

        if (this.bloodSurge)
        {
            embed.addField(
                `Blood Surge Check [ ${this.bloodSurge.dice.join(" ")} ]`,
                `\`\`\`diff\n${this.bloodSurge.description}\n\`\`\``
            );
        }

        if (this.rouseRoll)
        {
            embed.addField(
                `Rouse Check [ ${this.rouseRoll.dice.join(", ")} ]`,
                `\`\`\`diff\n${this.rouseRoll.description}\n\`\`\``
            );
        }

        if (this.notes) embed.setFooter(this.notes);
        
        this.response.embed = embed;
        return embed;
    }

    constructContent()
    {
        const client = this.interaction.client;
        this.v5SkullRed = client.emojis.resolve('901732920807546911');
        this.v5AnkhRed = client.emojis.resolve('901731712558567474');
        this.v5AnkhCritRed = client.emojis.resolve('901726454734290994');
        this.v5AnkhBlack = client.emojis.resolve('901731712487288852');
        this.v5AnkhCritBlack = client.emojis.resolve('901726422513614898');
        this.v5DotRed = client.emojis.resolve('901721705981046835');
        this.v5DotBlack = client.emojis.resolve('901721784976568360');
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
            content += ' ';
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

        // Need to update character if Hunger increased
        let hunger = 0;
        if (this.bloodSurge?.passed === false) hunger++;
        if (this.rouseRoll?.passed === false) hunger++;
        await this.updateCharacter(hunger, false);

        /*
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
        */
        const filter = i => (
            i.message.interaction.id == this.interaction.id &&
            (i.customId === 'autoReroll' || i.customId === 'selectReroll')         
        );
        const channel = 
            await this.interaction.client.channels.fetch(this.interaction.channelId);
        
        this.collector = channel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14)
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
            const user = this.interaction.user;
            DatabaseAPI.diceStatsUpdate(
                {
                    'id': user.id,
                    'username': user.username,
                    'discriminator': user.discriminator,
                    'avatarURL': user.avatarURL() ?? ''
                },
                Versions.v5,
                this.statsResult,
                this.isReroll
            );
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
    
    async updateCharacter(hunger, willpower)
    {
        if (!this.character?.tracked || 
            this.character.tracked.splat != 'Vampire' || 
            this.character.tracked.version != '5th' || 
            (!hunger && !willpower)) return;

        if (willpower)
        {
            this.character.tracked.willpower.takeSuperfical(1);
        }

        if (hunger)
        {
            this.character.tracked.hunger.updateCurrent(hunger);
        }
        
        const resp = await DatabaseAPI.saveCharacter(this.character.tracked);
        if (resp != 'saved')
        {            
            this.interaction.followUp({
                content: "There was an error accessing the Database and" +
                " the character was not updated."
            });
        }
        else
        {
            this.interaction.followUp(
                character5thEmbed(
                    this.character.tracked, 
                    this.interaction.client
                )
            );
        }
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

    if (bp != null)
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