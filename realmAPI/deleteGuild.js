'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');


module.exports = async function deleteGuild(guildId)
{
  const path = `chronicle/delete`;
  const data = {guild_id: guildId}

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Deleted 
      return;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}