'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const { getCharacterClass } = require('../modules');
const RealmAPIError = require('../Errors/RealmAPIError');

/**
 * Finds a character in the Database if one exists
 * @param {String} name Name of the character being fetched
 * @param {User|GuildMember} user A Discord User OR GuildMember
 * @param {Guild} guild Discord Guild if there is one 
 * @param {String} splatSlug Slug of the splat if known
 * @param {String} pk Priamary Key of the character if known
 * @returns {Promise<Character>} Returns a Character class if one is found or null if not
 */
module.exports = async function getCharacter(name, user, 
  {guild=null, splatSlug=null, pk=null}={})
{
  const path = 'character/get';
  const data = {
    APIKey: APIKey, 
    name: name, 
    userId: user.id, 
    splatSlug: splatSlug ?? null,
    pk: pk ?? null
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found a character
      const json = res.data.character
      const CharacterClass = getCharacterClass(json.splat);
      const char = new CharacterClass({
        name: json.name,
        user: user,
        guild, guild
      });
      return char.deserilize(json);
    case 204: // No character
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}