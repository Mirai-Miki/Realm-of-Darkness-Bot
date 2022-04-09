'use strict';
const { MessageEmbed } = require("discord.js");

const DotColour =
{
    bloodRed: 0,
    purpleBlack: 1,
    royalWhite: 2,
    royalBlack: 3,
    yellowBlack: 4,
}

module.exports.character20thEmbed = (char, client, notes) =>
{   
    let embed = new MessageEmbed()
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
        .addField(`Willpower [${char.willpower.current}/${char.willpower.total}]`, 
            consumableTracker(char.willpower, 1, client, 10), false)
        .setURL('https://discord.gg/Qrty3qKv95');

        if (char.thumbnail) embed.setThumbnail(char.thumbnail);

        switch (char.splat)
        {
            case 'Ghoul':
                embed.addField(`Vitae [${char.vitae.current}/5]`, 
                consumableTracker(char.vitae, DotColour.bloodRed, client, 5), false);

            case 'Human':
                embed.addField(`Blood [${char.blood.current}/10]`, 
                consumableTracker(char.blood, DotColour.bloodRed, client, 10), false);
                embed.addField(`Humanity ${char.morality.pool.current}`, 
                    consumableTracker(
                        char.morality.pool, DotColour.purpleBlack, client), false);
                break;

            case 'Vampire':  
                if (char.blood.total > 15)
                {
                    embed.addField("Blood", consumableTracker(
                        char.blood, DotColour.bloodRed, client), false);
                }
                else 
                {
                    embed.addField(
                        `Blood [${char.blood.current}/${char.blood.total}]`, 
                        consumableTracker(char.blood, DotColour.bloodRed, client, 10), false
                    );
                }
                embed.addField(`${char.morality.name} ${char.morality.pool.current}`, 
                consumableTracker(char.morality.pool, DotColour.purpleBlack, client));
                break;
            
            case 'Werewolf':  
                embed.addField(
                    `Rage [${char.rage.current}/${char.rage.total}]`, 
                    consumableTracker(char.rage, DotColour.royalWhite, client, 10), false
                );
                embed.addField(
                    `Gnosis [${char.gnosis.current}/${char.gnosis.total}]`, 
                    consumableTracker(char.gnosis, DotColour.purpleBlack, client, 10), false
                );
                break;

            case 'Wraith':  
                embed.addField(
                    `Corpus [${char.corpus.current}/${char.corpus.total}]`, 
                    consumableTracker(char.corpus, DotColour.bloodRed, client, 10), false
                );
                embed.addField(
                    `Pathos ${char.pathos.current}`, 
                    consumableTracker(char.pathos, DotColour.royalBlack, client), false
                );
                break;

            case 'Changeling':
                embed.addField(
                    `Imbalance ${char.nightmare.permanant}`, 
                    consumableTracker(
                        {
                            total: 10,
                            current: char.nightmare.permanant
                        }, 
                        DotColour.royalWhite, client
                    ), 
                    false
                );
                embed.addField(
                    `Glamour [${char.glamour.current}/${char.glamour.total}]`, 
                    consumableTracker(char.glamour, DotColour.royalBlack, client, 10), false
                );
                embed.addField(
                    `Banality Permanant ${char.banality.permanant}`, 
                    consumableTracker(
                        {
                            total: 10,
                            current: char.banality.permanant
                        }, 
                    DotColour.royalWhite, client, 10
                    ), 
                    false
                );
                embed.addField(
                    `Banality Temporary ${char.banality.temporary}`, 
                    consumableTracker(
                        {
                            total: 10,
                            current: char.banality.temporary
                        },
                        DotColour.yellowBlack, client, 10
                    ), 
                    false
                );
                embed.addField(
                    `Nightmare ${char.nightmare.temporary}`, 
                    consumableTracker(
                        {
                            total: 10,
                            current: char.nightmare.temporary
                        }, 
                        DotColour.bloodRed, client
                    ), 
                    false
                );                
                embed.addField(
                    `Chimerical Health`, 
                    damageTracker(char.chimericalHealth, client), false
                );
                break;

            case 'Mage':  
                embed.addField(
                    `Arete ${char.arete.current}`, 
                    consumableTracker(char.arete, DotColour.bloodRed, client), false
                );
                embed.addField(
                    `Quintessence ${char.quintParadox.current} ` +
                    `& Paradox ${(20 - char.quintParadox.total)}`, 
                    quintParaTracker(char.quintParadox, client), false
                );
                break;
            case 'Demon':  
                embed.addField(
                    `Faith [${char.faith.current}/${char.faith.total}]`, 
                    consumableTracker(char.faith, DotColour.bloodRed, client, 10), false
                );
                embed.addField(
                    `Torment - Permenent: ${char.torment.permanant}`, 
                    consumableTracker(
                        {total: 10, current: char.torment.permanant}, 
                        DotColour.royalBlack, 
                        client
                    ), 
                    false
                );
                embed.addField(
                    `Torment - Temporary: ${char.torment.temporary}`, 
                    consumableTracker(
                        {total: 10, current: char.torment.temporary}, 
                        DotColour.royalWhite, 
                        client
                    ), 
                    false
                );
                break;
        }

        embed.addField("Health", damageTracker(char.health, client), false);
        if (char.exp.total) 
            embed.addField("Experience", 
            consumableTracker(char.exp, 0, client, 0, true), false);

        if (notes) embed.setFooter(notes);

        const response = {embeds: [embed], ephemeral: true};
        return response;
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
            tracker += '⠀';

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
    tracker += '⠀';
    
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
        if (i == 5 || i == 10) tracker += '⠀';

        if (i >= field.total && i < field.current) tracker += emoji.overflow;
        else if (i < field.current) 
        {
            switch (color)
            {
                case DotColour.bloodRed:
                    tracker += emoji.bloodDot;
                    break;
                case DotColour.purpleBlack:
                    tracker += emoji.purpleDot;
                    break;
                case DotColour.royalBlack:
                    tracker += emoji.royalBlack;
                    break;
                case DotColour.royalWhite:
                    tracker += emoji.royalWhite;
                    break;
                case DotColour.yellowBlack:
                    tracker += emoji.overflow;
            }
        }
        else if (i < field.total) tracker += emoji.emptyDot;
        else tracker += emoji.blackDot;                 
    }
    tracker += '⠀';
    return tracker;
}

function quintParaTracker(quintPara, client)
{
    let emoji = initEmoji(client);

    let tracker = "";

    for (let i = 0; i < 20; i++) 
    {
        if (i == 5 || i == 15) tracker += '⠀';
        else if (i == 10) tracker += '\n';

        if (i < quintPara.current) tracker += emoji.royalWhite;
        else if (i >= quintPara.total) tracker += emoji.overflow;
        else tracker += emoji.emptyDot;                
    }
    return tracker;
}

function initEmoji(client)
{
    let emoji = {
        bloodDot: '▣',
        purpleDot: '▣',
        royalWhite: '▣',
        royalBlack: '▣',
        emptyDot: '☐',
        overflow: '⧄',
        blackDot: '•',
    };

    if (client.emojis.resolve("817642148794335253") &&
        client.emojis.resolve("820913320378236939") &&
        client.emojis.resolve("817641377826471936") &&
        client.emojis.resolve("901323344450818109") &&
        client.emojis.resolve("894443295533584384") &&
        client.emojis.resolve("894443199140085780") &&
        client.emojis.resolve("894443929183871027"))
    {
        emoji.bloodDot = client.emojis.resolve("817642148794335253").toString();
        emoji.purpleDot = client.emojis.resolve("820913320378236939").toString();
        emoji.emptyDot = client.emojis.resolve("817641377826471936").toString();
        emoji.blackDot = client.emojis.resolve("901323344450818109").toString();
        emoji.overflow = client.emojis.resolve("894443295533584384").toString();
        emoji.royalWhite = client.emojis.resolve("894443199140085780").toString();
        emoji.royalBlack = client.emojis.resolve("894443929183871027").toString();
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