'use strict';
const { MessageActionRow, MessageButton } = require('discord.js');
const { isSupporter, correctName } = require('../../util/Util.js');


module.exports = 
{
    set(args, interaction)
    {
        let response = '';
        let button;
        args.name = correctName(args.name);

        if (args.moralityType) args.moralityType = correctName(args.moralityType);
        if (args.nameChange) args.nameChange = correctName(args.nameChange);

        if (args.name.length > 50)
        {
            response = "Character Name must not be longer than 50.";
        }
        if (args.willpower && (args.willpower < 1 || args.willpower > 10))
        {
            response = "Willpower must be between 1 and 10.";
        }
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
        else if (args.health && (args.health < 7 || args.health > 15))
        {
            response = "Health must be between 7 and 15.";
        }
        else if (args.exp && (args.exp < 0 || args.exp > 10000))
        {
            response = "exp must be between 0 and 10000.";
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
        else if (args.nameChange?.length > 50)
        {
            response = "Character Name must not be longer than 50.";
        }
        else if (args.thumbnail && !isSupporter(interaction.user.id))
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
            if (!isSupporter(interaction.user.id))
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
                if (colourMatch.length != 3)
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
        return r;
    },

    update(args)
    {
        let response = '';
        args.name = correctName(args.name);

        if (args.willpower && (args.willpower < -15 || args.willpower > 15))
        {
            response = "Willpower must be between -15 and 15.";
        }
        if (args.blood && (args.blood < -200 || args.blood > 200))
        {
            response = "Blood Pool must be between -200 and 200.";
        }
        else if (args.morality && (args.morality < -20 || args.morality > 20))
        {
            response = "Morality must be between -20 and 20.";
        }
        else if (args.health && (args.health < -20 || args.health > 20))
        {
            response = "Health must be between -20 and 20.";
        }
        else if (args.exp && (args.exp < -10000 || args.exp > 10000))
        {
            response = "exp must be between -10000 and 10000.";
        }
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

        return {content: response, ephemeral: true};
    }
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
    if (!url.match(/^http(s)?:\/\/.(www\.)?.+\.((png)|(jpg)|(jpeg)|(gif))$/g))
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