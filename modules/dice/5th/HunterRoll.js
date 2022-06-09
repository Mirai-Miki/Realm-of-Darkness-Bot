'use strict'

const Roll = require('../Roll.js');
const { MessageActionRow, MessageSelectMenu, 
    MessageButton, MessageEmbed } = require('discord.js');
const { minToMilli } = require('../../util/misc.js');
const { ErrorEmbed } = require('../../../Errors/ErrorEmbed');
 
const result = 
{
    TOTAL_FAIL: 0,
    DESPAIR: 1,
    FAIL: 2,
    PASS: 3,
    CRIT: 4,
    OVERREACH: 5,
    OVERREACH_CRIT: 6,
    CHOOSE: 7,
}

module.exports = async function HunterDice(interaction)
{
    const roll = {
        pool: interaction.options.getInteger('pool'),
        desperation: interaction.options.getInteger('desperation') ?? null,
        diff: interaction.options.getInteger('difficulty') ?? 0,
        spec: interaction.options.getString('speciality') ?? null,
        character: interaction.options.getString('character') ?? null,
        notes: interaction.options.getString('notes') ?? null,
        dice: [],
        dDice: [],
        total: 0,
        fails: 0,
        despair: false,
        crit: false,
        reroll: false,
        rerolled: [],
        result: null
    };

    if (roll.character?.length > 50) 
        return await interaction.editReply(ErrorEmbed.CHAR_LEN);
    else if (roll.spec?.length > 100) 
        return await interaction.editReply(ErrorEmbed.SPEC_LEN);
    else if (roll.notes?.length > 300) 
        return await interaction.editReply(ErrorEmbed.NOTES_LEN);

    rollDice(roll);
    const message = constructReply(roll, interaction);
    await reply(interaction, message, roll);
}

function rollDice(roll)
{
    roll.dice = Roll.manySingle((roll.pool + (roll.spec ? 1 : 0)), 10)[10];
    if (roll.desperation) roll.dDice = Roll.manySingle(roll.desperation, 10)[10];

    calculateResults(roll);
}

function calculateResults(roll)
{
    let tens = 0;
    roll.crit = false;
    roll.despair = false;
    roll.fails = 0;
    roll.total = 0;

    for(const dice of roll.dice)
    {
        if (dice === 10)
        {
            tens++;
            roll.total++;
        }
        else if (dice >= 6) roll.total++;
        else roll.fails++;
    }

    for(const dice of roll.dDice)
    {
        if (dice === 10)
        {
            tens++;
            roll.total++;
        }
        else if (dice >= 6) roll.total++;
        else if (dice === 1) roll.despair = true;
    }

    const crit = (tens % 2) ? (tens - 1) : tens;
    roll.total += crit;
    if(crit) roll.crit = true;

    if ((roll.result === result.OVERREACH || 
        (roll.result === result.DESPAIR && roll.total >= roll.diff)) && crit) 
        roll.result = result.OVERREACH_CRIT;
    else if (roll.result === result.OVERREACH || 
        (roll.result === result.DESPAIR && roll.total >= roll.diff)) 
        roll.result = result.OVERREACH;
    else if (roll.despair && roll.total < roll.diff) roll.result = result.DESPAIR;
    else if (roll.despair) roll.result = result.CHOOSE;
    else if (crit && roll.total >= roll.diff) roll.result = result.CRIT;
    else if (roll.total >= roll.diff) roll.result = result.PASS;
    else if (roll.result === 0) roll.result =  result.TOTAL_FAIL;
    else roll.result = result.FAIL; 
}

function constructReply(roll, interaction)
{
    const message = {content: null, embeds: [], components: []};
    message.content = constructContent(roll, interaction.client.emojis);
    message.embeds = constructEmbed(roll, interaction);
    message.components = constructComponents(roll);
    return message;
}

function constructContent(roll, emojis)
{
    const emotes =
    {
        despair: emojis.resolve('901732920807546911').toString(),
        desperationFail: emojis.resolve('901721705981046835').toString(),
        desperationPass: emojis.resolve('901731712558567474').toString(),
        desperationCrit: emojis.resolve('901726454734290994').toString(),
        normalFail: emojis.resolve('901721784976568360').toString(),
        normalPass: emojis.resolve('901731712487288852').toString(),
        normalCrit: emojis.resolve('901726422513614898').toString(),
    }

    let content = '';
    for (const dice of roll.dice)
    {
        if (dice === 10) content += emotes.normalCrit;
        else if (dice >= 6) content += emotes.normalPass;
        else content += emotes.normalFail;
    }

    for (const dice of roll.dDice)
    {
        if (dice === 10) content += emotes.desperationCrit;
        else if (dice >= 6) content += emotes.desperationPass;
        else if (dice === 1) content += emotes.despair;
        else content += emotes.desperationFail;
    }

    return ((content.length > 2000) ? null : content);
}


function constructEmbed(roll, interaction)
{
    const embed = new MessageEmbed();

    // Set Author
    embed.setAuthor({
        name: (interaction.member?.displayName ?? interaction.user.username), 
        iconURL: interaction.member?.displayAvatarURL() ??
            interaction.user.displayAvatarURL()
    });

    // Create Title
    let title = `Pool ${roll.pool + (roll.spec ? 1:0)}`;
    if (roll.desperation) title += ` | Desperation ${roll.desperation}`;
    if (roll.diff) title += ` | Difficulty ${roll.diff}`;
    if (roll.spec) title += ' | Spec';
    embed.setTitle(title);
    embed.setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');        


    if (roll.character) embed.addField("Character", roll.character);  
    if (roll.reroll)
    {
        let description = `${roll.rerolled.join(', ')}`
        embed.addField(`Rerolled ${roll.rerolled.length} Dice`, description);
    }
    
    embed.addField("Dice", `${roll.dice.join(' ')}`, true);
    if (roll.desperation) embed.addField(
        "Desperation", `${roll.dDice.join(' ')}`, true);
    if (roll.spec) embed.addField("Specialty", roll.spec);          
    if (roll.notes) embed.addField("Notes", roll.notes);    
    
    let resultMessage = "";
    if (!roll.diff) resultMessage += `Rolled: ${roll.total} sux`;
    else
    {
        resultMessage += `${roll.total} sux`;
        resultMessage += ` vs diff ${roll.diff}`;
        // Adding Margin to Result Message
        if (roll.total > roll.diff)
        {
            resultMessage += `\nMargin of ${roll.total - roll.diff}`;
        }
        else if (roll.total < roll.diff)
        {
            resultMessage += `\nMissing ${roll.diff - roll.total}`;
        }
    }

    if (roll.result === result.CHOOSE)
    {
        resultMessage += '\n```Choose you Fate!```';
        embed.setColor("#ba1ebd"); // Purple
    }
    else if (roll.result === result.CRIT)
    {
        resultMessage += '\n```cs\n\' Critical \'\n```';
        embed.setColor("#66ffcc"); // Auqa
    }
    else if (roll.result === result.OVERREACH)
    {
        resultMessage += '\n```diff\n- Overreach -\n```';
        embed.setColor("#e6a35c"); // Faded orange
    }
    else if (roll.result === result.OVERREACH_CRIT)
    {
        resultMessage += '\n```diff\n- Critical Overreach -\n```';
        embed.setColor("#fcbd79"); // Faded orange
    }
    else if (roll.result === result.PASS)
    {
        resultMessage += '\n```diff\n+ Success +\n```';
        embed.setColor("#3ee33b"); // Green
    }
    else if (roll.result === result.DESPAIR)
    {
        resultMessage += '\n```diff\n- Despair -\n```';
        embed.setColor("#e07400"); // Orange
    }
    else if (roll.result === result.FAIL)
    {
        resultMessage += '\n```fix\n Failed \n```';
        embed.setColor("#363636"); // Black
    }
    else if (roll.result === result.TOTAL_FAIL)
    {
        resultMessage += '\n```fix\n Total Failure \n```';
        embed.setColor("#cf1723"); // Red
    }
    embed.addField("Result", `${resultMessage}`);
    const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.fields.at(-1).value += links;
    return [embed];
}

function constructComponents(roll)
{
    const buttonRow = new MessageActionRow()
    
    if (roll.result === result.CHOOSE)
    {
        buttonRow.addComponents(
            new MessageButton()
                .setCustomId('chooseOverreach')
                .setLabel('Choose Overreach')
                .setStyle('DANGER'),
        );
        buttonRow.addComponents(
            new MessageButton()
                .setCustomId('chooseDespair')
                .setLabel('Choose Despair')
                .setStyle('DANGER'),
        );
        return [buttonRow];
    }

    if (!roll.reroll && roll.fails)
    {
        buttonRow.addComponents(
            new MessageButton()
                .setCustomId('rerollFailures')
                .setLabel('Reroll Failures')
                .setStyle('PRIMARY'),
        );
    }
    if (!roll.reroll)
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
        return [buttonRow];
    }
    else return [];
}

function constructRerollSelect(roll)
{
    const sortedRolls = roll.dice.map(x => x);
    sortedRolls.sort((a, b) => a - b);
    const options = [];
    const count = {};
    
    for (const dice of sortedRolls)
    {        
        let description;
        if (dice < 6) description = 'Fail';
        else if (dice < 10) description = 'Success';
        else description = 'Critical';
        
        let value;
        if (count[dice])
        {
            count[dice] += 1;
            value = `${dice} (${count[dice]})`;
        }
        else
        {
            value = `${dice}`;
            count[dice] = 1;
        }
        
        options.push(
        {
            label: `${dice}`,
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

function reroll(interaction, roll, selected)
{
    const message = {content: null, embeds: [], components: []};
    roll.reroll = true;
    const values = selected?.map(x => parseInt(x.match(/^\d+/)[0]));
    let count = 0;

    const rDice = [];
    for (const dice of roll.dice)
    { 
        if ((values?.includes(dice)) || (!selected && count < 3 && dice < 6))
        {
            if (selected)
            {
                const index = values.indexOf(dice);
                if (index > -1) values.splice(index, 1);
            }
            const reroll = Roll.single(10);
            roll.rerolled.push(`${dice}>${reroll}`);
            rDice.push(reroll);
            count++;
        }
        else rDice.push(dice);
    }
    roll.dice = rDice;
    calculateResults(roll);

    message.content = constructContent(roll, interaction.client.emojis);
    message.embeds = constructEmbed(roll, interaction);
    return message;
}

function choose(roll, choice, interaction)
{
    const message = {content: null, embeds: [], components: []};

    roll.result = choice;
    message.content = constructContent(roll, interaction.client.emojis);
    message.embeds = constructEmbed(roll, interaction);
    if (choice === result.DESPAIR) return message;
    message.components = constructComponents(roll);
    return message;
}

async function reply(interaction, message, roll)
{
    try
    {
        await interaction.editReply(message);
    }
    catch(error)
    {
        console.error("Failed to reply to hunter Roll.");
        console.error(error);
        return;
    }  
    
    let channel;
    try
    {
        channel = await interaction.client.channels.fetch(interaction.channelId);
    }
    catch(error)
    {
        console.error("\n\nError: HunterRoll.js - reply()");
        console.error(error);
        return;
    }
    if (!channel) return;  
    
    const filter = i => (
        i.message.interaction.id === interaction.id &&
        (i.customId === 'rerollFailures' || i.customId === 'selectReroll' ||
        i.customId === 'chooseOverreach' || i.customId === 'chooseDespair')         
    );
    
    const collector = channel.createMessageComponentCollector(
    {
        filter,
        time: minToMilli(14)
    });
    
    collector.on('collect', async i => 
    {
        if (i.user.id === interaction.user.id) 
        {
            await i.deferUpdate();
            if (i.customId == 'rerollFailures')
            {
                // reroll
                const edit = reroll(interaction, roll, null);
                try
                {
                    await i.editReply(edit);
                }
                catch(error)
                {
                    console.error("Failed to update hunter reroll failures");
                    console.error(error);
                }                    
                collector.stop();
            }
            else if (i.customId == 'selectReroll' && i.isButton())
            {
                try
                {
                    await i.editReply({components: constructRerollSelect(roll)});
                }
                catch(error)
                {
                    console.error("Failed to update hunter select reroll button");
                    console.error(error);
                }                      
            }
            else if (i.customId == 'selectReroll' && i.isSelectMenu())
            {
                const edit = reroll(interaction, roll, i.values);
                try
                {
                    await i.editReply(edit);
                }
                catch(error)
                {
                    console.error("Failed to update hunter select reroll");
                    console.error(error);
                }                      
                collector.stop();
            }
            else if (i.customId == 'chooseOverreach')
            {
                const choice = 
                    (roll.crit ? result.OVERREACH_CRIT : result.OVERREACH);
                const edit = choose(roll, choice, interaction);
                try
                {
                    await i.editReply(edit);
                }
                catch(error)
                {
                    console.error("Failed to choose overreach");
                    console.error(error);
                } 
            }
            else if (i.customId == 'chooseDespair')
            {
                const edit = choose(roll, result.DESPAIR, interaction);
                try
                {
                    await i.editReply(edit);
                }
                catch(error)
                {
                    console.error("Failed to choose despair");
                    console.error(error);
                }                      
                collector.stop();
            }
        } else {
            await i.deferReply({ ephemeral: true });
            try
            {
                await i.editReply(ErrorEmbed.BUTTON_PERM);
            }
            catch(error)
            {
                console.error("Failed to send Ephemeral error in v5 roll");
                console.error(error);
            }                
        }
    });

    collector.on('end', async (i, reason) => {
        try
        {
            if (reason === 'time')
            {
                await interaction.editReply({components: []});
            }
            else (reason === 'guildDelete')
            {
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
            return;
        }
    });
}