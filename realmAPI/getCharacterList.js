'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const RealmAPIError = require('../Errors/RealmAPIError');
const { serializeGuild, serializeUserOrGuildMember } = require('./serializers');

/**
 * Gets a list of user characters
 * @param {User|GuildMember} user 
 * @param {Guild} guild 
 * @returns {Promis<Array<String>|null>} List of character || Null if none exist 
 */
module.exports = async function getCharacterList(user, guild)
{  
  const path = 'character/name_list';
  const data = {
    APIKey: APIKey, 
    user: serializeUserOrGuildMember(user),
    guild: serializeGuild(guild),
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Fetched a names list
      return res.data.list;
    case 204: // No character
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}