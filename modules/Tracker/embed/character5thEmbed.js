'use strict';

const Discord = require("discord.js");
const { getErrorMessage } = require('../getErrorMessage.js');

module.exports.character5thEmbed = (char, tracker, unknownKeys) =>
{
    let client = tracker.recvMess.client;
    let recvMess = tracker.recvMess;
    if (tracker.error) return `<@${recvMess.author.id}> ` +
        `${getErrorMessage(tracker.error)}`;

    let stainsOverflow = "";
    let hungerOverflow = "";
    let willImpairment = "";
    let healthImpairment = "";

    if (!(char.health.total - char.health.aggravated))
    {
        healthImpairment = "You have entered Torpor or are Dead. p223";
    }
    else if (!(char.health.total - char.health.superficial - 
            char.health.aggravated)) {
        healthImpairment = "You are currently Impaired. p126";
    }

    if (!(char.willpower.total - char.willpower.superficial - 
            char.willpower.aggravated)) {
        willImpairment = "You are currently Impaired. p126";
    }

    if (char.humanity.overflow) {
        stainsOverflow = `${char.humanity.overflow} `;

        if (char.humanity.overflow == 1) stainsOverflow += 'stain';
        else if (char.humanity.overflow) stainsOverflow += 'stains';

        stainsOverflow += " overflowed. You are now in Degeneration. p239";  
    }

    // Adding Hunger messages if character has hunger
    if (char.hunger && char.hunger.overflow > 0) {
        hungerOverflow = `${char.hunger.overflow} hunger has ` +
            "overflowed. You should now do a hunger frenzy check. p220"
    }
    else if (char.hunger && char.hunger.current == 5) {
        hungerOverflow = `Hunger is currently 5` +
            ". You can no longer intentionally rouse the blood. p211"
    }      
   
    let embed = new Discord.MessageEmbed()
        .setColor(char.colour)
        .setAuthor(char.owner.username, char.owner.avatarURL)
        .setTitle(char.name)
        .addField("Willpower", 
            (damageTracker(char.willpower.total, 
                char.willpower.superficial, 
                char.willpower.aggravated, client) +
                willImpairment),
            false)
        .addField("Health", 
            (damageTracker(char.health.total, 
                char.health.superficial, char.health.aggravated, client) +
                healthImpairment),
            false)
        .addField("Humanity", 
            (humanityTracker(char.humanity.total, 
                char.humanity.stains, client) + 
                stainsOverflow),
            false)
        .setURL('https://discord.gg/Za738E6');
                
        if (char.splat === 'Vampire')
        {
            embed.addField("Hunger", 
                (hungerTracker(char.hunger.current, client) + 
                hungerOverflow), false);
        }

        if (char.exp.total) embed.addField("Experience", consumableTracker(
            char.exp.current, char.exp.total, 0, client, true), false);

        if (tracker.notes) 
            embed.addField("Notes", tracker.notes);

        if (unknownKeys.length) 
            embed.addField("Unknown Keys", unknownKeys.join(' | '));

        // Adding History if History flag is Set
        if (tracker.findHistory && char.history)
        {
            var history = `__**History for ${char.name}**__\n`;
            for (const record of char.history)
            {
                history += `${record}ﾠ\n`;
            }
        }

        if (history) return {embed: embed, history: history};
        else return embed;        
}

function damageTracker(max, supDamage, aggDamage, client) {
    let emoji = getDamageEmoji(client);

    let tracker = "";
    let undamaged = (max - supDamage - aggDamage);
    for (let i = 0; i < max; i++) {
        if (i == 5 || i == 10 || i == 15) {
            tracker += 'ﾠ';
        }

        if (undamaged) {
            tracker += emoji.greenBox;
            undamaged--;
        } else if (aggDamage) {
            tracker += emoji.redBox;
            aggDamage--;
        } else if (supDamage) {
            tracker += emoji.yellowBox;
        } else {
            console.error("Error in damageTracker()");
        }        
    }
    tracker += 'ﾠ';
    return tracker;
}

function humanityTracker(max, stains, client) {
    let emoji = getEmoji(client);

    let tracker = "";
    let undamaged = (10 - max - stains);
    for (let i = 0; i < 10; i++) {
        if (i == 5) {
            tracker += 'ﾠ';
        }

        if (max) {
            tracker += emoji.purpleDot;
            max--;
        } else if (undamaged) {
            tracker += emoji.blackDot;
            undamaged--;
        } else if (stains) {
            tracker += emoji.stain;
        } else {
            console.error("Error in humanityTracker()");
        }        
    }
    tracker += 'ﾠ';
    return tracker;
}

function hungerTracker(hunger, client) {
    let emoji = getEmoji(client);
    let count = 0;

    let tracker = "";
    for (let i = 0; i < 5; i++) {
        if (count < hunger) 
        {
            tracker += emoji.bloodDot;
            count++;
        }
        else tracker += emoji.emptyDot;
                
    }
    tracker += 'ﾠ';
    return tracker;
}

function consumableTracker(current, max, color, client, noEmoji=false) {
    let emoji = getEmoji(client);
    let tracker = "";

    if (max > 15 || noEmoji)
    {
        tracker = `\`\`\`q\n[${current}/${max}]\n\`\`\``
        return tracker;
    }

    for (let i = 0; i < max; i++) {
        if (i < current) 
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
        else tracker += emoji.emptyDot;                
    }
    tracker += 'ﾠ';
    return tracker;
}

function getEmoji(client)
{
    let emoji = {}
    emoji.bloodDot = '▣'
    emoji.purpleDot = '▣'
    emoji.emptyDot = '☐'
    emoji.blackDot = '•'
    emoji.stain = '💀'

    if (client.emojis.resolve("817642148794335253") &&
        client.emojis.resolve("820913320378236939") &&
        client.emojis.resolve("817641377826471936") &&
        client.emojis.resolve("814391880258682881") &&
        client.emojis.resolve("814397402185728001"))
    {
        emoji.bloodDot = client.emojis.resolve("817642148794335253").toString();
        emoji.purpleDot = client.emojis.resolve("820913320378236939").toString();
        emoji.emptyDot = client.emojis.resolve("817641377826471936").toString();
        emoji.blackDot = client.emojis.resolve("814391880258682881").toString();
        emoji.stain = client.emojis.resolve("814397402185728001").toString();
    }
    return emoji
}

function getDamageEmoji(client)
{
    let emoji = {}
    // No Damage
    emoji.greenBox = '☐'
    // Superficial Damage
    emoji.yellowBox = '⧄'
    // Agg Damage
    emoji.redBox = '☒'

    if (client.emojis.resolve("820909151328141312") &&
        client.emojis.resolve("820909188154523649") &&
        client.emojis.resolve("820909202678743061"))
    {
        emoji.greenBox = client.emojis.resolve("820909151328141312").toString();
        emoji.yellowBox = client.emojis.resolve("820909188154523649").toString();
        emoji.redBox = client.emojis.resolve("820909202678743061").toString();
    }
    return emoji
}