'use strict'
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const { RealmAPIError } = require('../Errors');

module.exports = async function saveCharacter(character)
{
  {
    const path = '/bot/character/save';
    const data = character.serialize();
    data['APIKey'] = APIKey;
    
    const res = await postData(path, data);
    switch(res?.status)
    {
      case 201: // Saved successfully
        return 'saved';
      case 304: // Not Modified
        throw new RealmAPIError();
      default:
        throw new RealmAPIError();

    }
  }
}