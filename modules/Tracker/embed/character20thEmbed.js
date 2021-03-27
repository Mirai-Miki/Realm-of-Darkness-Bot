const Discord = require("discord.js");
const { getErrorMessage } = require('../getErrorMessage.js');

module.exports.character20thEmbed = (char, tracker, unknownKeys) =>
{
    let client = tracker.recvMess.client;
    let recvMess = tracker.recvMess;
    if (tracker.error) return `<@${recvMess.author.id}> ` +
        `${getErrorMessage(tracker.error)}`;

    let name;
    if (recvMess.member) name = recvMess.member.displayName;
    else name = recvMess.author.username;
   
    let embed = new Discord.MessageEmbed()
        .setColor(char.colour)
        .setAuthor(name, recvMess.author.avatarURL())
        .setTitle(char.name)
        .addField(`Willpower [${char.willpower.current}/${char.willpower.total}]`, 
            consumableTracker(char.willpower.current, 
            char.willpower.total, 1, client),false)
        .setURL('https://discord.gg/Za738E6');

        switch (char.splat)
        {
            case 'Ghoul':
                embed.addField("Vitea", consumableTracker(), false);

            case 'Human':

            case 'Vampire':  
                if (char.blood.total > 15)
                {
                    embed.addField("Blood", consumableTracker(
                        char.blood.current, char.blood.total, 0, client), false);
                }
                else 
                {
                    embed.addField(
                        `Blood [${char.blood.current}/${char.blood.total}]`, 
                        consumableTracker(char.blood.current,
                        char.blood.total, 0, client), false);
                }
                embed.addField(`Humanity ${char.humanity}`, consumableTracker(
                    char.humanity, 10, 1, client));
                break;
        }

        embed.addField("Health", damageTracker(char, client), false);
        if (char.exp.total) 
            embed.addField("Experiance", consumableTracker(char.exp.current,
                char.exp.total, 0, client, true), false);

        if (tracker.notes) embed.addField("Notes", tracker.notes);
        if (unknownKeys.length) 
            embed.addField("Unknown Keys", unknownKeys.join(' | '));

        return embed;        
}

function damageTracker(char, client) {
    // No Damage
    let greenBox = client.emojis.resolve("820909151328141312").toString();
    // Bashing Damage
    let yellowBox = client.emojis.resolve("820909188154523649").toString();
    // Lethal Damage
    let redBox = client.emojis.resolve("820909202678743061").toString();
    // Agg Damage
    let purpleBox = client.emojis.resolve("825368831920177192").toString();

    let tracker = "";
    let MAX_DAMAGE = 7
    let undamaged = (MAX_DAMAGE - char.health.getTotal());
    let bashing = char.health.bashing;
    let lethal = char.health.lethal;
    let agg = char.health.aggravated;

    for (let i = 0; i < MAX_DAMAGE; i++) 
    {
        if (i == 2 || i == 4 || i == 6) tracker += 'ﾠ';

        if (agg) 
        {
            tracker += purpleBox;
            agg--;
        }         
        else if (lethal) 
        {
            tracker += redBox;
            lethal--;
        }          
        else if (bashing) 
        {
            tracker += yellowBox;
            bashing--;
        } 
        else if (undamaged) 
        {
            tracker += greenBox;
            undamaged--;        
        }
        else console.error("Error in damageTracker()");        
    }
    tracker += 'ﾠ';
    
    let total = char.health.getTotal()
    if (char.health.overflow)
    {
        tracker += `Damage overflowed by ${char.health.overflow} while ` +
            'Incapacitated.\nCheck the corebook for rules on what happens now.'
        return tracker;
    }

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

function consumableTracker(current, max, color, client, noEmoji=false) {
    let bloodDot = client.emojis.resolve("817642148794335253").toString();
    let purpleDot = client.emojis.resolve("820913320378236939").toString();
    let emptyDot = client.emojis.resolve("817641377826471936").toString();

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
                    tracker += bloodDot;
                    break;
                case 1:
                    tracker += purpleDot;
                    break;
            }
        }
        else tracker += emptyDot;                
    }
    tracker += 'ﾠ';
    return tracker;
}