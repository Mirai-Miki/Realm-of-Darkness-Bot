'use strict';
const Discord = require("discord.js");

module.exports.character5thEmbed = (char, client, args) =>
{
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

    if (char.humanity?.overflow) {
        stainsOverflow = `${char.humanity.overflow} `
        if (char.humanity.overflow)
        {
            stainsOverflow += `${char.humanity.overflow > 1 ? 'stains' : 'stain'}`;
        }
        stainsOverflow += " overflowed. You are now in Degeneration. p239";  
    }

    // Adding Hunger messages if character has hunger
    if (char.hunger?.overflow > 0) {
        hungerOverflow = `${char.hunger.overflow} hunger has ` +
            "overflowed. You should now do a hunger frenzy check. p220"
    }
    else if (char.hunger?.current == 5) {
        hungerOverflow = `Hunger is currently 5` +
            ". You can no longer intentionally rouse the blood. p211"
    }      
    
    let embed = new Discord.MessageEmbed()
        .setColor(char.colour)
        .setAuthor(
            {
                name: (
                    char.guild?.displayName ?? char.user.username
                ), 
                iconURL: char.user.avatarURL
            }
        )
        .setTitle(char.name)
        .addField(
            "Willpower", 
            (damageTracker(char.willpower.total, 
                char.willpower.superficial, 
                char.willpower.aggravated, client) +
                willImpairment),
            false)
        .addField(
            "Health", 
            (damageTracker(char.health.total, 
                char.health.superficial, char.health.aggravated, client) +
                healthImpairment),
            false)
        .setURL('https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png');
    
    if (char.thumbnail) embed.setThumbnail(char.thumbnail);
    
    if (char.splat === 'Vampire' || char.splat === 'Mortal')
    {        
        embed.addField(
            "Humanity", 
            (humanityTracker(char.humanity.total, char.humanity.stains, client) + 
                stainsOverflow),
            false
        )
    }
    if (char.splat === 'Vampire')
    {
        embed.addField(
            "Hunger", 
            (fivePointTracker(char.hunger.current, client) + 
            hungerOverflow), false);
    }
    else if (char.splat === 'Hunter')
    {        
        let emoji = getDespairEmoji(client);
        embed.addField(
            "Desperation",
            fivePointTracker(char.desperation.current, client),
            true
        );
        embed.addField(
            "Danger",
            fivePointTracker(char.danger.current, client),
            true
        );
        embed.addField(
            "Despair",
            `${char.despair ? emoji.despairOn: emoji.despairOff}`,
            false
        )

    }

    if (char.exp.total) embed.addField("Experience", consumableTracker(
        char.exp.current, char.exp.total, 0, client, true), false);

    if (args?.notes) 
        embed.addField("Notes", args.notes);

    const links = "\n[Website](https://realmofdarkness.app/)" +
        " | [Commands](https://realmofdarkness.app/v5/commands/)" +
        " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.fields.at(-1).value += links;

    const response = {embeds: [embed], ephemeral: true};
    return response;        
}

function damageTracker(max, supDamage, aggDamage, client) {
    let emoji = getDamageEmoji(client);

    let tracker = "";
    let undamaged = (max - supDamage - aggDamage);
    for (let i = 0; i < max; i++) {
        if (i == 5 || i == 10 || i == 15) {
            tracker += '⠀';
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
    tracker += '⠀';
    return tracker;
}

function humanityTracker(max, stains, client) {
    let emoji = getEmoji(client);

    let tracker = "";
    let undamaged = (10 - max - stains);
    for (let i = 0; i < 10; i++) {
        if (i == 5) {
            tracker += '⠀';
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
    tracker += '⠀';
    return tracker;
}

function fivePointTracker(current, client) {
    let emoji = getEmoji(client);
    let count = 0;

    let tracker = "";
    for (let i = 0; i < 5; i++) {
        if (count < current) 
        {
            tracker += emoji.bloodDot;
            count++;
        }
        else tracker += emoji.emptyDot;
                
    }
    tracker += '⠀';
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
    tracker += '⠀';
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
        client.emojis.resolve("901323344450818109") &&
        client.emojis.resolve("814397402185728001"))
    {
        emoji.bloodDot = client.emojis.resolve("817642148794335253").toString();
        emoji.purpleDot = client.emojis.resolve("820913320378236939").toString();
        emoji.emptyDot = client.emojis.resolve("817641377826471936").toString();
        emoji.blackDot = client.emojis.resolve("901323344450818109").toString();
        emoji.stain = client.emojis.resolve("814397402185728001").toString();
    }
    return emoji
}

function getDamageEmoji(client)
{
    let emoji = {};
    // No Damage
    emoji.greenBox = '☐';
    // Superficial Damage
    emoji.yellowBox = '⧄';
    // Agg Damage
    emoji.redBox = '☒';

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

function getDespairEmoji(client)
{
    let emoji = {};
    emoji.despairOff = '⬜';
    emoji.despairOn = '🟧';

    if (client.emojis.resolve("984730246194561024") &&
        client.emojis.resolve("984730249260572692"))
    {
        emoji.despairOff = client.emojis.resolve("984730246194561024").toString();
        emoji.despairOn = client.emojis.resolve("984730249260572692").toString();
    }
    return emoji
}