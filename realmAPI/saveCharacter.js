'use strict'
const { postData } = require('./postData.js');
const { RealmAPIError, APIErrorCodes } = require('../Errors');

/**
 * Takes in a character and saves the information to the Database
 * @param {Character} character The character class being saved 
 * @returns Returns true on save or throws an Error if not.
 */
module.exports = async function saveCharacter(cData)
{
  {
    const path = cData.character.class ? 'character/save' : 'character/save_old';
    const res = await postData(path, cData);
    switch(res?.status)
    {
      case 200: // Saved successfully
        return true;
      case 304: // Not Modified
        throw new RealmAPIError({code: APIErrorCodes.CharacterExists});
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
    }
  }
}