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
                    `Imbalence ${char.imbalence.current}`, 
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
            for (record of char.history)
            {
                history += `${record}ﾠ\n`;
            }
        }

        return {embed: embed, history: history};        
}

function damageTracker(health, client) {
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
    let undamaged = (MAX_DAMAGE - health.getTotal());
    let bashing = health.bashing;
    let lethal = health.lethal;
    let agg = health.aggravated;

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
    
    let total = health.getTotal()
    if (health.overflow)
    {
        tracker += `Damage overflowed by ${health.overflow} while ` +
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

function consumableTracker(field, color, client, pad=0, noEmoji=false) 
{
    let bloodDot = client.emojis.resolve("817642148794335253").toString();
    let purpleDot = client.emojis.resolve("820913320378236939").toString();
    let emptyDot = client.emojis.resolve("817641377826471936").toString();
    let blackDot = client.emojis.resolve("814391880258682881").toString();

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
                    tracker += bloodDot;
                    break;
                case 1:
                    tracker += purpleDot;
                    break;
            }
        }
        else if (i < field.total) tracker += emptyDot;
        else tracker += blackDot;                 
    }
    tracker += 'ﾠ';
    return tracker;
}

function staticFieldTracker(field, color, client, noEmoji=false)
{
    let bloodDot = client.emojis.resolve("817642148794335253").toString();
    let purpleDot = client.emojis.resolve("820913320378236939").toString();
    let emptyDot = client.emojis.resolve("814391880258682881").toString();

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
                    tracker += bloodDot;
                    break;
                case 1:
                    tracker += purpleDot;
                    break;
            }
        }
        else if (field.max > 15) break;
        else tracker += emptyDot;                
    }
    tracker += 'ﾠ';
    return tracker;
}