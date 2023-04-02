'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');

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
    user_id: user.id,
    guild_id: guild?.id,
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Fetched a names list
      return res.data.list;
    case 204: // No character
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}