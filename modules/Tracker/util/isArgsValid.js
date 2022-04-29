'use strict';
const { MessageActionRow, MessageButton } = require('discord.js');
const { correctName } = require('../../util/misc.js');
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
    else if (args.notes?.length > 200)
    {
        response = "Notes cannot be more then 200 characters long.";
    }
    else if (args.moralityType?.length > 50)
    {
        response = "Morality name must not be longer than 50.";
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
        interaction.editReply(r);
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

    if (response)
    {
        interaction.editReply({content: response, ephemeral: true});
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