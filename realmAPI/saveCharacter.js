'use strict'
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const { RealmAPIError } = require('../Errors');

/**
 * Takes in a character and saves the information to the Database
 * @param {Character} character The character class being saved 
 * @returns Returns true on save or throws an Error if not.
 */
module.exports = async function saveCharacter(character)
{
  {
    const path = 'character/save';
    const data = character.serialize();
    data['APIKey'] = APIKey;
    
    const res = await postData(path, data);
    switch(res?.status)
    {
      case 200: // Saved successfully
        return true;
      case 304: // Not Modified
        throw new RealmAPIError({cause: 'Status 304: Not Modified'});
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
    }
  }
}