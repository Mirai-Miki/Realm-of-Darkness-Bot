'use strict';
const { MessageActionRow, MessageButton } = require('discord.js');
const { correctName } = require('../../util/misc.js');
const { Versions } = require('../../util/Constants');
const DatabaseAPI = require('../../util/DatabaseAPI.js');


module.exports.isSetArgsValid = async (args, interaction, version) =>
{
    let response = '';
    let button;
    args.name = correctName(args.name);

    if (args.moralityType) args.moralityType = correctName(args.moralityType);
    if (args.nameChange) args.nameChange = correctName(args.nameChange);

    let wasProvided = false;
    for (const key of Object.keys(args))
    {
        if (key === 'name') continue;
        else if (args[key] != null)
        {
            wasProvided = true;
            break;
        }
    }

    if (!wasProvided) 
    {
        response = 'You must include at least one argument.'
    }
    else if (args.name.length > 50)
    {
        response = "Character Name must not be longer than 50.";
    }
    else if (args.nameChange?.length > 50)
    {
        response = "Character Name must not be longer than 50.";
    }
    else if (args.notes?.length > 150)
    {
        response = "Notes cannot be more then 150 characters long.";
    }
    else if (args.exp && (args.exp < 0 || args.exp > 10000))
    {
        response = "exp must be between 0 and 10000.";
    }
    // Used for both v20 and v5 but in differant ways
    else if (args.willpower && (args.willpower < 1 || args.willpower > 10))
    {
        response = "Willpower must be between 1 and 10.";
    }
    // 20th Anniversary Edition
    else if (args.health && Versions.v20 === version &&
        (args.health < 7 || args.health > 15))
    {
        response = "Health must be between 7 and 15.";
    }
    else if (args.bashing && (args.bashing < 0 || args.bashing > 15))
    {
        response = "Bashing Damage must be between 0 and 15.";
    }
    else if (args.lethal && (args.lethal < 0 || args.lethal > 15))
    {
        response = "Lethal Damage must be between 0 and 15.";
    }
    else if (args.agg && (args.agg < 0 || args.agg > 15))
    {
        response = "Aggravated Damage must be between 0 and 15.";
    }
    // VTM 20th. Humans, Ghouls and Vamps
    else if (args.blood && (args.blood < 1 || args.blood > 100))
    {
        response = "Blood Pool must be between 1 and 100.";
    }
    else if (args.morality && (args.morality < 0 || args.morality > 10))
    {
        response = "Morality must be between 0 and 10.";
    }
    else if (args.moralityType?.length > 50)
    {
        response = "Morality name must not be longer than 50.";
    }
    // Changeling 20th
    else if (args.glamour && (args.glamour < 1 || args.glamour > 10))
    {
        response = "Glamour must be between 1 and 10.";
    }
    else if (args.banality && (args.banality < 1 || args.banality > 10))
    {
        response = "banality must be between 1 and 10.";
    }
    else if (args.nightmare && (args.nightmare < 0 || args.nightmare > 10))
    {
        response = "Nightmare must be between 0 and 10.";
    }
    else if (args.imbalence && (args.imbalence < 0 || args.imbalence > 10))
    {
        response = "Imbalence must be between 0 and 10.";
    }
    else if (args.healthChimerical &&
        (args.healthChimerical < 7 || args.healthChimerical > 15))
    {
        response = "Chimerical Health must be between 7 and 15.";
    }
    else if (args.bashingChimerical && 
        (args.bashingChimerical < 0 || args.bashingChimerical > 15))
    {
        response = "Bashing Chimerical Damage must be between 0 and 15.";
    }
    else if (args.lethalChimerical && 
        (args.lethalChimerical < 0 || args.lethalChimerical > 15))
    {
        response = "Lethal Chimerical Damage must be between 0 and 15.";
    }
    else if (args.aggChimerical && 
        (args.aggChimerical < 0 || args.aggChimerical > 15))
    {
        response = "Aggravated Chimerical Damage must be between 0 and 15.";
    }
    // Werewolf 20th
    else if (args.rage && (args.rage < 1 || args.rage > 10))
    {
        response = "Rage must be between 1 and 10.";
    }
    else if (args.gnosis && (args.gnosis < 1 || args.gnosis > 10))
    {
        response = "Gnosis must be between 1 and 10.";
    }
    // Mage 20th
    else if (args.arete && (args.arete < 0 || args.arete > 10))
    {
        response = "Arete must be between 0 and 10.";
    }
    else if (args.quintessence && 
        (args.quintessence < 0 || args.quintessence > 20))
    {
        response = "Quintessence must be between 0 and 20.";
    }
    else if (args.paradox && (args.paradox < 0 || args.paradox > 20))
    {
        response = "Paradox must be between 0 and 20.";
    }
    // Wraith 20th
    else if (args.corpus && (args.corpus < 1 || args.corpus > 10))
    {
        response = "Corpus must be between 1 and 10.";
    }
    else if (args.pathos && (args.pathos < 0 || args.pathos > 10))
    {
        response = "Gnosis must be between 0 and 10.";
    }
    // Demon TF
    else if (args.faith && (args.faith < 1 || args.faith > 10))
    {
        response = "Faith must be between 1 and 10.";
    }
    else if (args.tormentPerm && 
        (args.tormentPerm < 1 || args.tormentPerm > 10))
    {
        response = "Permanent Torment must be between 1 and 10.";
    }
    else if (args.tormentTemp && 
        (args.tormentTemp < 0 || args.tormentTemp > 10))
    {
        response = "Temporary Torment must be between 0 and 10.";
    }
    // 5th edition
    else if (args.health && Versions.v5 === version &&
        (args.health < 1 || args.health > 15))
    {
        response = "Health must be between 1 and 15.";
    }
    else if (args.willpowerSup && 
        (args.willpowerSup < 0 || args.willpowerSup > 10))
    {
        response = "Superficial Willpower Damage must be between 0 and 10.";
    }
    else if (args.willpowerAgg && 
        (args.willpowerAgg < 0 || args.willpowerAgg > 10))
    {
        response = "Aggravated Willpower Damage must be between 0 and 10.";
    }
    else if (args.healthSup && 
        (args.healthSup < 0 || args.healthSup > 15))
    {
        response = "Superficial Health Damage must be between 0 and 15.";
    }
    else if (args.healthAgg && 
        (args.healthAgg < 0 || args.healthAgg > 15))
    {
        response = "Aggravated Health Damage must be between 0 and 15.";
    }
    // Vampire 5th and Morths 5th
    else if (args.hunger && 
        (args.hunger < 0 || args.hunger > 5))
    {
        response = "Hunger must be between 0 and 5.";
    }
    else if (args.humanity && 
        (args.humanity < 0 || args.humanity > 10))
    {
        response = "Humanity must be between 0 and 10.";
    }
    else if (args.stains && 
        (args.stains < 0 || args.stains > 10))
    {
        response = "Stains must be between 0 and 10.";
    }
    // Picture and Colour
    else if (args.thumbnail && (await DatabaseAPI.getSupporterLevel(interaction) < 1))
    {
        [ response, button ] = vanityError();
    }
    else if (args.thumbnail && !isValidImageURL(args.thumbnail) && args.thumbnail != 'none')
    {
        response = 'This is not a valid image URL. Please enter a valid' +
            " image URL of type png, jpeg or gif.\n" +
            "The easiest way to do this is upload your file to discord and" +
            " select the copy link option from it.\n" +
            ' Type `None` if you would like to remove the image.';
    }
    else if (args.colour)
    {
        if (await DatabaseAPI.getSupporterLevel(interaction) < 1)
        {
            [ response, button ] = vanityError();
        }
        else
        {
            const colourError = "Colour must be 3 space seperated numbers." +
            "\nNumbers cannot be less than 0 or greater then 255." +
            "\nIn order each number represents the colours Red, " +
            "Green and Blue.\nExample: `colour: 35 255 144`";

            const colourMatch = args.colour.match(/\d+/g);
            if (colourMatch?.length != 3)
            {
                response = colourError;
            }
            else
            {
                const colours = [];

                for (const colourStr of colourMatch)
                {
                    const colour = parseInt(colourStr);
                    if (colour < 0 || colour > 255)
                    {
                        response = colourError;
                        break;
                    }
                    colours.push(colour);
                }
                args.colour = colours;
            }            
        }
    }
        
    const r = {content: response, ephemeral: true};
    if (button) r['components'] = button;

    if (response)
    {
        interaction.reply(r);
        return false;
    }
    return true;
}

module.exports.isUpdateArgsValid = async (args, interaction) =>
{
    let response = '';
    args.name = correctName(args.name);

    let wasProvided = false;
    for (const key of Object.keys(args))
    {
        if (key === 'name') continue;
        else if (args[key] != null)
        {
            wasProvided = true;
            break;
        }
    }

    if (!wasProvided) 
    {
        response = 'You must include at least one argument.'
    }
    else if (args.notes?.length > 150)
    {
        response = "Notes cannot be more then 150 characters long.";
    }
    else if (args.exp && (args.exp < -10000 || args.exp > 10000))
    {
        response = "exp must be between -10000 and 10000.";
    }        
    // Used for both v20 and v5 but in differant ways
    else if (args.willpower && (args.willpower < -15 || args.willpower > 15))
    {
        response = "Willpower must be between -15 and 15.";
    }
    else if (args.health && (args.health < -20 || args.health > 20))
    {
        response = "Health must be between -20 and 20.";
    }
    // 20th Anniversary Edition
    else if (args.bashing && (args.bashing < -50 || args.bashing > 50))
    {
        response = "Bashing Damage must be between -50 and 50.";
    }
    else if (args.lethal && (args.lethal < -50 || args.lethal > 50))
    {
        response = "Lethal Damage must be between -50 and 50.";
    }
    else if (args.agg && (args.agg < -50 || args.agg > 50))
    {
        response = "Aggravated Damage must be between -50 and 50.";
    }
    // VTM 20th. Humans, Ghouls and Vamps
    else if (args.blood && (args.blood < -200 || args.blood > 200))
    {
        response = "Blood Pool must be between -200 and 200.";
    }
    else if (args.morality && (args.morality < -20 || args.morality > 20))
    {
        response = "Morality must be between -20 and 20.";
    }
    // Changeling 20th
    else if (args.glamour && (args.glamour < -15 || args.glamour > 15))
    {
        response = "Glamour must be between -15 and 15.";
    }
    else if (args.banality && (args.banality < -15 || args.banality > 15))
    {
        response = "banality must be between -15 and 15.";
    }
    else if (args.nightmare && (args.nightmare < -15 || args.nightmare > 15))
    {
        response = "Nightmare must be between -15 and 15.";
    }
    else if (args.imbalence && (args.imbalence < -15 || args.imbalence > 15))
    {
        response = "Imbalence must be between -15 and 15.";
    }
    else if (args.healthChimerical &&
        (args.healthChimerical < -20 || args.healthChimerical > 20))
    {
        response = "Chimerical Health must be between -20 and 20.";
    }
    else if (args.bashingChimerical && 
        (args.bashingChimerical < -50 || args.bashingChimerical > 50))
    {
        response = "Bashing Chimerical Damage must be between -50 and 50.";
    }
    else if (args.lethalChimerical && 
        (args.lethalChimerical < -50 || args.lethalChimerical > 50))
    {
        response = "Lethal Chimerical Damage must be between -50 and 50.";
    }
    else if (args.aggChimerical && 
        (args.aggChimerical < -50 || args.aggChimerical > 50))
    {
        response = "Aggravated Chimerical Damage must be between -50 and 50.";
    }
    // Werewolf 20th
    else if (args.rage && (args.rage < -20 || args.rage > 20))
    {
        response = "Rage must be between -20 and 20.";
    }
    else if (args.gnosis && (args.gnosis < -20 || args.gnosis > 20))
    {
        response = "Gnosis must be between -20 and 20.";
    }
    // Mage 20th
    else if (args.arete && (args.arete < -20 || args.arete > 20))
    {
        response = "Arete must be between -20 and 20.";
    }
    else if (args.quintessence && 
        (args.quintessence < -30 || args.quintessence > 30))
    {
        response = "Quintessence must be between -30 and 30.";
    }
    else if (args.paradox && (args.paradox < -30 || args.paradox > 30))
    {
        response = "Paradox must be between -30 and 30.";
    }
    // Wraith 20th
    else if (args.corpus && (args.corpus < -20 || args.corpus > 20))
    {
        response = "Corpus must be between -20 and 20.";
    }
    else if (args.pathos && (args.pathos < -20 || args.pathos > 20))
    {
        response = "Gnosis must be between -20 and 20.";
    }
    // Demon TF
    else if (args.faith && (args.faith < -15 || args.faith > 15))
    {
        response = "Faith must be between -15 and 15.";
    }
    else if (args.tormentPerm && 
        (args.tormentPerm < -15 || args.tormentPerm > 15))
    {
        response = "Permanent Torment must be between -15 and 15.";
    }
    else if (args.tormentTemp && 
        (args.tormentTemp < -15 || args.tormentTemp > 15))
    {
        response = "Temporary Torment must be between -15 and 15.";
    }
    // 5th edition
    else if (args.willpowerSup && 
        (args.willpowerSup < -15 || args.willpowerSup > 15))
    {
        response = "Superficial Willpower Damage must be between -15 and 15.";
    }
    else if (args.willpowerAgg && 
        (args.willpowerAgg < -15 || args.willpowerAgg > 15))
    {
        response = "Aggravated Willpower Damage must be between -15 and 15.";
    }
    else if (args.healthSup && 
        (args.healthSup < -20 || args.healthSup > 20))
    {
        response = "Superficial Health Damage must be between -20 and 20.";
    }
    else if (args.healthAgg && 
        (args.healthAgg < -20 || args.healthAgg > 20))
    {
        response = "Aggravated Health Damage must be between -20 and 20.";
    }
    // Vampire 5th and Morths 5th
    else if (args.hunger && 
        (args.hunger < -10 || args.hunger > 10))
    {
        response = "Hunger must be between -10 and 10.";
    }
    else if (args.humanity && 
        (args.humanity < -15 || args.humanity > 15))
    {
        response = "Humanity must be between -15 and 15.";
    }
    else if (args.stains && 
        (args.stains < -15 || args.stains > 15))
    {
        response = "Stains must be between -15 and 15.";
    }

    if (response)
    {
        interaction.reply({content: response, ephemeral: true});
        return false;
    }
    return true;
}


function vanityError()
{
    const content = "This vanity option is only available to Supporters." +
        "\nBeing a supporter really helps me out with develpment and" +
        " running costs. As a bonus it give you access to little" +
        " goodies such as this.\n" +
        "You can become a Supporter from as little as $1 a month" +
        " on [Patreon](https://www.patreon.com/MiraiMiki)."

    const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Patreon')
                .setStyle('LINK')
                .setURL('https://www.patreon.com/MiraiMiki'),
        );
    return [ content, [button] ];
}

function isValidImageURL(url)
{
    if (!url.match(/^http(s)?:\/\/.(www\.)?.+\.((png)|(jpg)|(jpeg)|(gif))/ig))
    {
        return false;
    }
    
    try 
    {
        const u = new URL(url);
    } 
    catch (error) 
    {  
        return false;  
    }

    return true;
}