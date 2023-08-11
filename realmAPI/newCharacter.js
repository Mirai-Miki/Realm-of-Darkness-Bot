'use strict'
const { postData } = require('./postData.js');
const { RealmAPIError, APIErrorCodes } = require('../Errors');
const { Splats } = require('../Constants');

module.exports = async function newCharacter(data)
{
  {
    const path = (data.character.class) ? 'character/new' : `character/new_old`;
    const res = await postData(path, data);
    switch(res?.status)
    {
      case 201: // Saved successfully
        return;
      case 304: // Not Modified -- existing character
        throw new RealmAPIError({code: APIErrorCodes.CharacterExists});
      case 409: // Conflict -- Too many characters
        throw new RealmAPIError({code: APIErrorCodes.CharacterLimitReached});
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
    }
  }
}