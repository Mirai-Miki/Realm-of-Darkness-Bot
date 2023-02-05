'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const { getCharacterClass } = require('../modules/util/getCharacterClass');
const RealmAPIError = require('../Errors/RealmAPIError');

/**
 * 
 * @param {String} name 
 * @param {String} userId 
 * @param {Interaction} interaction 
 * @param {String} splat 
 * @param {String} pk 
 * @returns 
 */
module.exports = 
async function getAPICharacter(name, userId, interaction=null, splat=null, pk=null)
{
  const path = 'character/get';
  const data = {
    APIKey: APIKey, 
    name: name, 
    userId: userId, 
    splat: splat ?? null,
    pk: pk ?? null
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found a character
      const character = res.data.character
      const CharacterClass = getCharacterClass(character.splat);
      const char = new CharacterClass(interaction);
      await char.build();
      char.deserilize(character);    
      return char;
    case 204: // No character
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}