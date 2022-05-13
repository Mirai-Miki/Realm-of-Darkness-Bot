'use strict';
const { MessageEmbed } = require('discord.js');
const { correctName } = require('../../util/misc.js');
const DatabaseAPI = require('../../util/DatabaseAPI.js');


module.exports.isSetArgsValid = async (args, interaction) =>
{
    const embed = new MessageEmbed()
        .setTitle("")
        .setColor("#db0f20")
        .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png");
    let error = false;

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
        embed.setDescription('You must include at least one argument.');
        embed.setTitle("No Argument Error");
        error = true;
    }
    else if (args.name.length > 50)
    {
        embed.setDescription("Character Name must not be longer than 50.");
        embed.setTitle("String Length Error");
        error = true;
    }
    else if (args.nameChange?.length > 50)
    {
        embed.setDescription("Character Name must not be longer than 50.");
        embed.setTitle("String Length Error");
        error = true;
    }
    else if (args.notes?.length > 200)
    {
        embed.setDescription("Notes cannot be more then 200 characters long.");
        embed.setTitle("String Length Error");
        error = true;
    }
    else if (args.moralityType?.length > 50)
    {
        embed.setDescription("Morality name must not be longer than 50.");
        embed.setTitle("String Length Error");
        error = true;
    }
    // Picture and Colour
    else if (args.thumbnail && (await DatabaseAPI.getSupporterLevel(interaction) < 1))
    {
        vanityError(embed);
        error = true;
    }
    else if (args.thumbnail && !isValidImageURL(args.thumbnail) && args.thumbnail != 'none')
    {
        embed.setDescription('This is not a valid image URL. Please enter a valid' +
            " image URL of type png, jpeg or gif.\n" +
            "The easiest way to do this is upload your file to discord and" +
            " select the copy link option from it.\n" +
            ' Type `None` if you would like to remove the image.');
        embed.setTitle("URL parsing Error");
        error = true;
    }
    else if (args.colour)
    {
        if (await DatabaseAPI.getSupporterLevel(interaction) < 1)
        {
            vanityError(embed);
            error = true;
        }
        else
        {
            const colourError = "Colour must be a colour hex code." +
                "\nYou can get these by searching \"Colour Picker\" on google." +
                "\nExample: `colour: #d4caff`";

            const colourMatch = args.colour.match(/^\s*#[0-9A-F]{6}\s*$/i);
            if (!colourMatch)
            {
                embed.setDescription(colourError);
                embed.setTitle("Colour Parsing Error");
                error = true;
            }
            else
            {
                let red = parseInt(args.colour.trim().substring(1, 3), 16);
                let green = parseInt(args.colour.trim().substring(3, 5), 16);
                let blue = parseInt(args.colour.trim().substring(5, 7), 16);             
                args.colour = [red, green, blue];
            }            
        }
    }

    const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.description += links;

    if (error)
    {
        await interaction.editReply({embeds: [embed], ephemeral: true});
        return false;
    }
    return true;
}

module.exports.isUpdateArgsValid = async (args, interaction) =>
{
    const embed = new MessageEmbed()
        .setTitle("")
        .setColor("#db0f20")
        .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png");
    let error = false;

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
        embed.setDescription('You must include at least one argument.');
        embed.setTitle("No Argument Error");
        error = true;
    }
    else if (args.notes?.length > 150)
    {
        embed.setDescription("Notes cannot be more then 150 characters long.");
        embed.setTitle("No Argument Error");
        error = true;
    }

    const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.description += links;

    if (error)
    {
        interaction.editReply({embeds: [embed], ephemeral: true});
        return false;
    }
    return true;
}


function vanityError(embed)
{
    const link = "https://www.patreon.com/MiraiMiki";
    const content = "This vanity option is only available to Supporters." +
        "\nBeing a supporter really helps me out with develpment and" +
        " running costs. As a bonus it gives you access to little" +
        " goodies such as this.\n" +
        "You can become a Supporter" +
        " on [Patreon](https://www.patreon.com/MiraiMiki)." +
        "\nhttps://www.patreon.com/MiraiMiki";

    embed.setTitle("Patreon")
        .setDescription(content)
        .setColor("#fc626a")
        .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/973522873362825257/unknown.png")
        .setURL(link)
        .setImage("https://cdn.discordapp.com/attachments/699082447278702655/972058320611459102/banner.png");
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