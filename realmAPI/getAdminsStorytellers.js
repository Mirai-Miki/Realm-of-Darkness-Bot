'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');


module.exports = async function getAdminsStorytellers(guildId)
{
  const path = `chronicle/storytellers/get`;
  const data = {guild_id: guildId}

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Deleted 
      return res.data;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}