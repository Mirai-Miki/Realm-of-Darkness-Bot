'use strict'
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const { RealmAPIError, APIErrorCodes } = require('../Errors');

module.exports = async function saveCharacter(character)
{
  {
    const path = `character/new`;
    const data = character.serialize();
    data['APIKey'] = APIKey;
    
    const res = await postData(path, data);
    switch(res?.status)
    {
      case 201: // Saved successfully
        return;
      case 304: // Not Modified -- existing character
        throw new RealmAPIError({code: APIErrorCodes.CharacterExists});
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
    }
  }
}