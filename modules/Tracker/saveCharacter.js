'use strict'


module.exports = async function saveCharacter(character)
{
    const result = await DatabaseAPI.saveCharacter(handler.character)
    if (result === 'saved')
    {
        handler.constructEmbed();
        await handler.reply();
    }
    else if (result === 'exists') 
        await handleError(handler.interaction, 'exists');
    else if (result === 'charOverflow') 
        await handleError(handler.interaction, 'charOverflow');
    else 
        await handleError(handler.interaction, 'dbError');
}