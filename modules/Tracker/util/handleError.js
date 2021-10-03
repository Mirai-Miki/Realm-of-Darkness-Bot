
module.exports = function(interaction, error, handler)
{
    let errorMessage = '';

    if (error === 'noChar')
    {
        errorMessage = `Could not find a ${handler.splat} called` +
        ` ${handler.args.name}.\nPlease check the name and splat.`;
    }
    else if (error === 'exists')
    {
        errorMessage = "You already have a character" +
        " with this name. Please choose another.";
    }
    else if (error === 'dbError')
    {
        errorMessage = 'There was an error accessing the Database. Please try again' +
        ' later.\nIf this issue persists please report it at the ' +
        '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).';
    }
    else if (error === 'malformedURL')
    {
        errorMessage = "The URL you sent was Malformed." +
        " Please enter a valid image URL." +
        "\nThe easiest way to do this is upload your file to discord and" +
        " select the copy link option from it.";
    }
    else if (error === 'handlerReply')
    {
        errorMessage = 'There was in the Character Handler' +
        '.\nIf you see this message please report it at the ' +
        '[Realm of Darkness Server](<https://discord.gg/7xMqVrVeFt>).';
    }
    else if (error === 'charOverflow')
    {
        errorMessage = 'Sorry you have too many Characters. Please' +
            ' delete some to free up some space.';
    }

    interaction.reply({content: errorMessage, ephemeral: true});
}