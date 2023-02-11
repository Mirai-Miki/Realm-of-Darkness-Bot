'use strict';
const Roll = require('../Roll.js');
const { MessageActionRow, MessageSelectMenu, 
    MessageButton, MessageEmbed } = require('discord.js');
const { minToMilli, correctName } = require('../../util/misc.js');
const DatabaseAPI = require('../../../databaseAPI/DatabaseAPI.js');
const { Versions } = require('../../util/Constants');
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
        this.rerollResults = [];

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
        let description;
        if (this.character?.length > 50)
        {
            description = "Character name cannot be longer than 50 chars.";
        }        
        else if (this.spec?.length > 100)
        {
            description = "Speciality cannot be longer than 100 characters.";
        }
        else if (this.notes?.length > 300)
        {
            description = "Notes cannot be longer than 300 chars.";
        }
        else return true;

        const embed = new MessageEmbed()
            .setTitle("String Length Error")
            .setColor("#db0f20")
            .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png")
            .setDescription(`${description}` +
                "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
                " | [Patreon](https://www.patreon.com/MiraiMiki)");
        
        this.interaction.reply({embeds: [embed], ephemeral: true});
        return false;
    }

    async roll()
    {    
        if (this.character)
        {
            const name = correctName(this.character);
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

    async reroll(selected)
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
                    const roll = Roll.v5(1, 0)[0];
                    this.rerollResults.push(`${dice.result}>${roll.result}`)
                    reg.push(roll);
                }
                else reg.push(dice);
            }
            else hunger.push(dice);
        } 
        
        this.isReroll = true;
        this.results.roll = reg.concat(hunger);
        calculateResults(this.results, (this.diff ?? 1));

        await this.updateCharacter(0, true);
    }

    async constructEmbed()
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

        let color = [0, 0, 0]; // Black
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

        // Create Title
        let title = `Pool ${this.totalPool}`;
        if (this.hunger) title += ` | Hunger ${this.hunger}`;
        if (this.diff) title += ` | Difficulty ${this.diff}`;
        if (this.bp) title += ' | Surged';
        if (this.spec) title += ' | Spec';

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

        embed.setTitle(title); 
        
        if (this.character)
        {
            embed.addField("Character", this.character.name);
            if (this.character.tracked?.thumbnail) 
                embed.setThumbnail(this.character.tracked.thumbnail)
        }

        if (this.rerollCount)
        {
            let description = `${this.rerollResults.join(', ')}`
            embed.addField(`Rerolled ${this.rerollCount} Dice`, description);
        }

        if (blackResult.length) embed.addField(
            "Dice", `${blackResult.join(' ')}`, true);
        if (this.hunger) embed.addField(
            "Hunger", `${hungerResult.join(' ')}`, true);
        if (this.spec) embed.addField("Specialty", this.spec);        
        if (this.notes) embed.addField("Notes", this.notes);
        embed.addField("Result", `${resultMessage}`);
        embed.setColor(color);
        embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');        

        // Finishing touches
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
        
        const links = "\n[Website](https://realmofdarkness.app/)" +
            " | [Commands](https://realmofdarkness.app/v5/commands/)" +
            " | [Dice %](https://realmofdarkness.app/v5/dice/)" +
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
        embed.fields.at(-1).value += links;
        
        this.response.embed = embed;
        return embed;
    }

    async constructContent()
    {
        let client = this.interaction.client;
        const emotes = {
            v5SkullRed: client.emojis.resolve('901732920807546911').toString(),
            v5AnkhRed: client.emojis.resolve('901731712558567474').toString(),
            v5AnkhCritRed: client.emojis.resolve('901726454734290994').toString(),
            v5AnkhBlack: client.emojis.resolve('901731712487288852').toString(),
            v5AnkhCritBlack: client.emojis.resolve('901726422513614898').toString(),
            v5DotRed: client.emojis.resolve('901721705981046835').toString(),
            v5DotBlack: client.emojis.resolve('901721784976568360').toString()
        }
        client = undefined;

        let content = "";
        // Result Loop
        for (let dice of this.results.roll) 
        {
            // Adding each dice emoji to the start of the message
            if (dice.result == 1)
            {
                if (dice.type == 'v5b')
                {
                    content += emotes.v5DotBlack;
                }
                else
                {
                    content += emotes.v5SkullRed;
                }
            }
            else if (dice.result <= 5)
            {
                if (dice.type == 'v5b')
                {
                    content += emotes.v5DotBlack;
                }
                else
                {
                    content += emotes.v5DotRed;
                }
            }
            else if (dice.result <= 9)
            {
                if (dice.type == 'v5b')
                {
                    content += emotes.v5AnkhBlack;
                }
                else
                {
                    content += emotes.v5AnkhRed;
                }
            }
            else
            {
                if (dice.type == 'v5b')
                {
                    content += emotes.v5AnkhCritBlack;
                }
                else
                {
                    content += emotes.v5AnkhCritRed;
                }
            }
            content += ' ';
        }

        this.response.content = content;
        return content;
    }

    async constructInteractions()
    {
        const buttonRow = new MessageActionRow()
        if (this.results.fails)
        {
            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId('autoReroll')
                    .setLabel('Reroll Failures')
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

        try
        {
            await this.interaction.editReply(
                { 
                    content: this.response.content,  
                    embeds: [this.response.embed],
                    components: this.response.interactions,
                });
        }
        catch(error)
        {
            console.error("Failed to reply to v5 Roll.");
            console.error(error);
            this.cleanup();
            return;
        }        

        // Need to update character if Hunger increased
        let hunger = 0;
        if (this.bloodSurge?.passed === false) hunger++;
        if (this.rouseRoll?.passed === false) hunger++;
        await this.updateCharacter(hunger, false);

        const filter = i => (
            i.message.interaction.id == this.interaction.id &&
            (i.customId === 'autoReroll' || i.customId === 'selectReroll')         
        );
        
        let channel;
        try
        {
            channel = await this.interaction.client.channels
                .fetch(this.interaction.channelId);
        }
        catch(error)
        {
            console.error("\n\nError: WoD5thRoll.js - reply()");
            console.error(error);
            this.cleanup();
            return;
        }
        if (!channel) return this.cleanup();        
        
        this.collector = channel.createMessageComponentCollector(
            {
                filter,
                time: minToMilli(14)
            });
        
        this.collector.on('collect', async i => {
            if (i.user.id === this.interaction.user.id) {
                await i.deferUpdate();
                if (i.customId == 'autoReroll')
                {
                    // reroll
                    await this.reroll();
                    await this.constructEmbed();
                    await this.constructContent();
                    try
                    {
                        await i.editReply({ 
                            content: this.response.content,
                            embeds: [this.response.embed],                        
                            components: []
                        });
                    }
                    catch(error)
                    {
                        console.error("Failed to update v5 auto reroll");
                        console.error(error);
                    }                    
                    this.collector.stop();
                }
                else if (i.customId == 'selectReroll' && i.isButton())
                {
                    try
                    {
                        await i.editReply({components: await this.createRerollSelect()});
                    }
                    catch(error)
                    {
                        console.error("Failed to update v5 select reroll button");
                        console.error(error);
                    }                      
                }
                else if (i.customId == 'selectReroll' && i.isSelectMenu())
                {
                    await this.reroll(i.values);
                    await this.constructEmbed();
                    await this.constructContent();
                    try
                    {
                        await i.editReply({ 
                            content: this.response.content,
                            embeds: [this.response.embed],                        
                            components: []
                        });
                    }
                    catch(error)
                    {
                        console.error("Failed to update v5 select reroll");
                        console.error(error);
                    }                      
                    this.collector.stop();
                }
            } else {
                await i.deferReply({ ephemeral: true });
                try
                {
                    await i.editReply({ content: `These buttons aren't for you!`, 
                        ephemeral: true });
                }
                catch(error)
                {
                    console.error("Failed to send Ephemeral error in v5 roll");
                    console.error(error);
                }                
            }
        });

        this.collector.on('end', async (i, reason) => {
            try
            {
                if (reason === 'time')
                {
                    await this.interaction.editReply({components: []});
                }
                else (reason === 'guildDelete')
                {
                    await this.cleanup();
                    return;
                }
            }
            catch(error) 
            {
                if (error.code === 10008); //Do nothing;
                else 
                {
                    console.error("\n\nError removing v5 roll Components.");
                    console.error(`Reason: ${reason}`)
                    console.error(error);                    
                }
                await this.cleanup();
                return;
            }

            const user = this.interaction.user;
            await DatabaseAPI.diceStatsUpdate(
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
            await this.cleanup();
        });
    }
    
    async createRerollSelect()
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

    async cleanup()
    {
        this.interaction = undefined;
        this.character = undefined;
        this.response = undefined;
        this.statsResult = undefined;
        this.rerollResults = undefined;
        this.collector = undefined;
        this.results = undefined;
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