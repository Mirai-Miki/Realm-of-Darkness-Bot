'use strict';
const { postData } = require('./postData.js');
const getCharacterClass = require('../modules/getCharacterClass.js');
const { RealmAPIError, RealmError, ErrorCodes } = require('../Errors/index.js');

/**
 * Finds a character in the Database if one exists
 * @param {Client} client The discord client making the request
 * @param {String} name Name of the character being fetched
 * @param {User|GuildMember} user A Discord User OR GuildMember
 * @param {Guild} guild Discord Guild if there is one 
 * @param {String} splatSlug Slug of the splat if known
 * @param {String} pk Priamary Key of the character if known
 * @returns {Promise<Character>} Returns a Character class if one is found or null if not
 */
module.exports = async function getCharacterDefault({client, name=null, user=null, guild=null}={})
{ 
  const path = 'character/get/default';
  const data = {
    name: name, 
    user: user?.id,
    chronicle: guild?.id ?? null
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found a character
      const json = res.data
      
      const CharacterClass = getCharacterClass(json.splat);
      const char = new CharacterClass({client: client, name: json.name});
      await char.deserilize(json);
      return char;
    case 404: // No character
      throw new RealmError({code: ErrorCodes.NoCharacter});
    case 300: // No sheet selected
      throw new RealmError({code: ErrorCodes.NoCharacterSelected});
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}