
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
        '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
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
        errorMessage = 'There was an Error in the Character Handler' +
        '.\nIf you see this message please report it at the ' +
        '[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).';
    }
    else if (error === 'charOverflow')
    {
        errorMessage = 'Sorry you have too many Characters. Please' +
            ' delete some to free up some space.';
    }
    else if (error === 'missingPerm')
    {
        errorMessage = 'Sorry, you must either be an Administrator or ' +
        'Storyteller to select a user.\n' +
        'If you are trying to update your own Character please' +
        ' remove the "player" option and try again.';
    }
    else if (error === 'noGuild')
    {
        errorMessage = 'Sorry, selecting a player can only be used in a server.' +
        '\nIf you trying to update your own Character please' +
        ' remove the "player" option and try again.';
    }

    interaction.reply({content: errorMessage, ephemeral: true});
}