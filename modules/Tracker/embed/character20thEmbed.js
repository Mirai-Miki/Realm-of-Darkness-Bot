'use strict';

const Discord = require("discord.js");
const { getErrorMessage } = require('../getErrorMessage.js');

module.exports.character20thEmbed = (char, tracker, unknownKeys) =>
{
    let client = tracker.recvMess.client;
    let recvMess = tracker.recvMess;
    if (tracker.error) return `<@${recvMess.author.id}> ` +
        `${getErrorMessage(tracker.error)}`;
   
    let embed = new Discord.MessageEmbed()
        .setColor(char.colour)
        .setAuthor(char.owner.username, char.owner.avatarURL)
        .setTitle(char.name)
        .addField(`Willpower [${char.willpower.current}/${char.willpower.total}]`, 
            consumableTracker(char.willpower, 1, client, 10),false)
        .setURL('https://discord.gg/Za738E6');

        switch (char.splat)
        {
            case 'Ghoul':
                embed.addField(`Vitae [${char.vitae.current}/5]`, 
                consumableTracker(char.vitae, 0, client, 5), false);

            case 'Human':
                embed.addField(`Blood [${char.blood.current}/10]`, 
                consumableTracker(char.blood, 0, client, 10), false);
                embed.addField(`Humanity ${char.humanity.current}`, 
                    staticFieldTracker(char.humanity, 1, client), false);
                break;

            case 'Vampire':  
                if (char.blood.total > 15)
                {
                    embed.addField("Blood", consumableTracker(
                        char.blood, 0, client), false);
                }
                else 
                {
                    embed.addField(
                        `Blood [${char.blood.current}/${char.blood.total}]`, 
                        consumableTracker(char.blood, 0, client, 10), false
                    );
                }
                embed.addField(`Humanity ${char.humanity.current}`, 
                    staticFieldTracker(char.humanity, 1, client));
                break;
            
            case 'Werewolf':  
                embed.addField(
                    `Rage [${char.rage.current}/${char.rage.total}]`, 
                    consumableTracker(char.rage, 0, client, 10), false
                );
                embed.addField(
                    `Gnosis [${char.gnosis.current}/${char.gnosis.total}]`, 
                    consumableTracker(char.gnosis, 1, client, 10), false
                );
                break;

            case 'Wraith':  
                embed.addField(
                    `Corpus [${char.corpus.current}/${char.corpus.total}]`, 
                    consumableTracker(char.corpus, 0, client, 10), false
                );
                embed.addField(
                    `Pathos ${char.pathos.current}`, 
                    staticFieldTracker(char.pathos, 1, client), false
                );
                break;

            case 'Changeling':  
                embed.addField(
                    `Glamour [${char.glamour.current}/${char.glamour.total}]`, 
                    consumableTracker(char.glamour, 0, client, 10), false
                );
                embed.addField(
                    `Banality [${char.banality.current}/${char.banality.total}]`, 
                    consumableTracker(char.banality, 0, client, 10), false
                );
                embed.addField(
                    `Nightmare ${char.nightmare.current}`, 
                    staticFieldTracker(char.nightmare, 0, client), false
                );
                embed.addField(
                    `Imbalance ${char.imbalence.current}`, 
                    staticFieldTracker(char.imbalence, 0, client), false
                );
                embed.addField(
                    `Chimerical Health`, 
                    damageTracker(char.chimericalHealth, client), false
                );
                break;

            case 'Mage':  
                embed.addField(
                    `Arete ${char.arete.current}`, 
                    staticFieldTracker(char.arete, 0, client), false
                );
                embed.addField(
                    `quintessence ${char.quintessence.current}`, 
                    staticFieldTracker(char.quintessence, 0, client), false
                );
                embed.addField(
                    `Paradox ${char.paradox.current}`, 
                    staticFieldTracker(char.paradox, 0, client), false
                );
                break;
            case 'Demon':  
                embed.addField(
                    `Faith [${char.faith.current}/${char.faith.total}]`, 
                    consumableTracker(char.faith, 1, client, 10), false
                );
                embed.addField(
                    `Permanent Torment ${char.permTorment.current}`, 
                    staticFieldTracker(char.permTorment, 0, client), false
                );
                embed.addField(
                    `Temporary Torment ${char.tempTorment.current}`, 
                    staticFieldTracker(char.tempTorment, 0, client), false
                );
                break;
        }

        embed.addField("Health", damageTracker(char.health, client), false);
        if (char.exp.total) 
            embed.addField("Experience", 
            consumableTracker(char.exp, 0, client, 0, true), false);

        if (tracker.notes) embed.addField("Notes", tracker.notes);
        if (unknownKeys.length) 
            embed.addField("Unknown Keys", unknownKeys.join(' | '));

        // Adding History if History flag is Set
        if (tracker.findHistory && char.history)
        {
            var history = `__**History for ${char.name}**__\n`;
            for (let record of char.history)
            {
                history += `${record}ﾠ\n`;
            }
        }

        embed.setFooter("This bot is becoming v5 specific on the 27/10.\n" +
        "For more info and links to the 20th edition bot please visit the RoD Server.\n" +
        "Please add the new bot as soon as possible.\nPlease note that a database reset will also occur at this time.\nPlease make sure you note your character details before that.\n")

        if (history) return {embed: embed, history: history};
        else return embed;        
}

function damageTracker(health, client) {
    let emoji = getHealthEmoji(client)

    let tracker = "";
    let totalHealth = health.total;
    let undamaged = (totalHealth - health.getTotalDamage());
    let bashing = health.bashing;
    let lethal = health.lethal;
    let agg = health.aggravated;

    for (let i = 0; i < totalHealth; i++) 
    {
        if (i == 2 || i == 4 || i == 6 || i == 8 || i == 10 || i == 12 || i == 14) 
            tracker += 'ﾠ';

        if (agg) 
        {
            tracker += emoji.purpleBox;
            agg--;
        }         
        else if (lethal) 
        {
            tracker += emoji.redBox;
            lethal--;
        }          
        else if (bashing) 
        {
            tracker += emoji.yellowBox;
            bashing--;
        } 
        else if (undamaged) 
        {
            tracker += emoji.greenBox;
            undamaged--;        
        }
        else console.error("Error in damageTracker()");        
    }
    tracker += 'ﾠ';
    
    let total = health.getTotalDamage();
    if (health.overflow)
    {
        tracker += `Damage overflowed by ${health.overflow} while ` +
            'Incapacitated.\nCheck the corebook for rules on what happens now.'
        return tracker;
    }

    // Correct for extra levels of brusied
    if (total && total <= (totalHealth - 7)) total = 1;
    else if (total > (totalHealth - 7)) total -= (totalHealth - 7);

    switch (total)
    {
        case 7:
            tracker += 'Incapacitated\nCharacter is incapable of movement and is ' +
            'likely unconscious.';
            break;
        case 6:
            tracker += 'Crippled -5 to rolls\n' +
            'Character is catastrophically injured and may only crawl' +
            ' (one yard/meter per turn).';
            break;
        case 5:
            tracker += 'Mauled -2 to rolls\n' +
            'Character is badly injured and may only hobble about' +
            ' (three yards/meters per turn).';
            break;
        case 4:
            tracker += 'Wounded -2 to rolls\n' +
            'Character suffers significant damage and may not run' +
            ' (though he may still walk).\nAt this level, a character may' +
            ' only move or attack; he always loses dice when moving' +
            ' and attacking in the same turn.';
            break;
        case 3:
            tracker += 'Injured -1 to rolls\n' +
            'Character suffers minor injuries and movement is mildly' +
            ' inhibited (halve maximum running speed).';
            break;
        case 2:
            tracker += 'Hurt -1 to rolls\n' +
            'Character is superficially hurt';
            break;
        case 1:
            tracker += 'Bruised\n' +
            'Character is only bruised and suffers no dice pool penalties' +
            ' due to damage.';
    }
    return tracker
}

function consumableTracker(field, color, client, pad=0, noEmoji=false)
{
    let emoji = initEmoji(client)

    let tracker = "";
    
    if (field.total > 15 || noEmoji)
    {
        tracker = `\`\`\`q\n[${field.current}/${field.total}]\n\`\`\``
        return tracker;
    }

    let total = field.total;
    if (total < pad) total = pad;

    for (let i = 0; i < total; i++) 
    {
        if (i == 5 || i == 10) tracker += 'ﾠ';

        if (i < field.current) 
        {
            switch (color)
            {
                case 0:
                    tracker += emoji.bloodDot;
                    break;
                case 1:
                    tracker += emoji.purpleDot;
                    break;
            }
        }
        else if (i < field.total) tracker += emoji.emptyDot;
        else tracker += emoji.blackDot;                 
    }
    tracker += 'ﾠ';
    return tracker;
}

function staticFieldTracker(field, color, client, noEmoji=false)
{
    let emoji = initEmoji(client);

    let tracker = "";

    if (field.current > 15 || noEmoji)
    {
        tracker = `\`\`\`q\n[${field.current}]\n\`\`\``
        return tracker;
    }

    for (let i = 0; i < field.max; i++) 
    {
        if (i == 5 || i == 10) tracker += 'ﾠ';

        if (i < field.current) 
        {
            switch (color)
            {
                case 0:
                    tracker += emoji.bloodDot;
                    break;
                case 1:
                    tracker += emoji.purpleDot;
                    break;
            }
        }
        else if (field.max > 15) break;
        else tracker += emoji.emptyDot;                
    }
    tracker += 'ﾠ';
    return tracker;
}

function initEmoji(client)
{
    let emoji = {}
    emoji.bloodDot = '▣'
    emoji.purpleDot = '▣'
    emoji.emptyDot = '☐'
    emoji.blackDot = '•'

    if (client.emojis.resolve("817642148794335253") &&
        client.emojis.resolve("820913320378236939") &&
        client.emojis.resolve("817641377826471936") &&
        client.emojis.resolve("901323344450818109"))
    {
        emoji.bloodDot = client.emojis.resolve("817642148794335253").toString();
        emoji.purpleDot = client.emojis.resolve("820913320378236939").toString();
        emoji.emptyDot = client.emojis.resolve("817641377826471936").toString();
        emoji.blackDot = client.emojis.resolve("901323344450818109").toString();
    }
    return emoji
}

function getHealthEmoji(client)
{
    let emoji = {}
    // No Damage
    emoji.greenBox = '☐'
    // Bashing Damage
    emoji.yellowBox = '⧄'
    // Lethal Damage
    emoji.redBox = '☒'
    // Agg Damage
    emoji.purpleBox = '▩'

    if (client.emojis.resolve("820909151328141312") &&
        client.emojis.resolve("820909188154523649") &&
        client.emojis.resolve("820909202678743061") &&
        client.emojis.resolve("825368831920177192"))
    {
        emoji.greenBox = client.emojis.resolve("820909151328141312").toString();
        emoji.yellowBox = client.emojis.resolve("820909188154523649").toString();
        emoji.redBox = client.emojis.resolve("820909202678743061").toString();
        emoji.purpleBox = client.emojis.resolve("825368831920177192").toString();
    }
    return emoji
}