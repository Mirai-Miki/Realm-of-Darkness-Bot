'use strict';
const { postData } = require('./postData.js');
const getCharacterClass = require('../modules/getCharacterClass');
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
module.exports = async function getCharacter({name=null, user=null, 
  guild=null, splatSlug=null, pk=null}={})
{ 
  const path = 'character/get';
  const data = {
    name: name, 
    splat_slug: splatSlug,
    pk: pk,
    user_id: user?.id,
    guild_id: guild?.id
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found a character
      const json = res.data.character
      const CharacterClass = getCharacterClass(json.splat);
      const char = new CharacterClass({name: json.name});

      char.deserilize(json);
      if (user) char.setUser(user);
      if (guild) char.setGuild(guild);
      return char;
    case 204: // No character
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}