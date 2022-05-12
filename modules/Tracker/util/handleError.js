'use strict';
const { MessageEmbed } = require('discord.js');

module.exports = async function(interaction, error, handler)
{
    const embed = new MessageEmbed()
        .setColor("#db0f20")
        .setThumbnail("https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png")

    if (error === 'noChar')
    {
        embed.setTitle("No Character Error")
        embed.setDescription(`Could not find a ${handler.splat} called` +
            ` ${handler.args.name}.\nPlease check the name and splat.`);
    }
    else if (error === 'exists')
    {
        embed.setTitle("Duplicate Name Error")
        embed.setDescription("You already have a character" +
        " with this name. Please choose another.");
    }
    else if (error === 'dbError')
    {
        embed.setTitle("Database Error")
        embed.setDescription('There was an error accessing the Database. Please try again' +
        ' later.\nIf this issue persists please report it at the ' +
        '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).');
    }
    else if (error === 'malformedURL')
    {
        embed.setTitle("Malformed URL Error")
        embed.setDescription("The URL you sent was Malformed." +
        " Please enter a valid image URL." +
        "\nThe easiest way to do this is upload your file to discord and" +
        " select the copy link option from it.");
    }
    else if (error === 'handlerReply')
    {
        embed.setTitle("Handler Error")
        embed.setDescription('There was an Error in the Character Handler' +
        '.\nIf you see this message please report it at the ' +
        '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).');
    }
    else if (error === 'charOverflow')
    {
        embed.setTitle("Max Character Error")
        embed.setDescription('Sorry you have too many Characters. Please' +
        ' delete some to free up some space.');
    }
    else if (error === 'missingPerm')
    {
        embed.setTitle("Missing Permission Error")
        embed.setDescription('Sorry, you must either be an Administrator or ' +
        'Storyteller to select a user.\n' +
        'If you are trying to update your own Character please' +
        ' remove the "player" option and try again.');
    }
    else if (error === 'noGuild')
    {
        embed.setTitle("Direct Message Error")
        embed.setDescription('Sorry, selecting a player can only be used in a server.' +
        '\nIf you trying to update your own Character please' +
        ' remove the "player" option and try again.');
    }

    const links = "\n[RoD Server](https://discord.gg/Qrty3qKv95)" + 
            " | [Patreon](https://www.patreon.com/MiraiMiki)";
    embed.description += links;

    try
    {
        await interaction.editReply({embeds: [embed], ephemeral: true});
    }
    catch(error)
    {
        console.error("Error sending tracker error.")
        console.error(error);
    }
}