'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');

module.exports = async function updateGuild(guild)
{
  if (!guild.available) return;
  const path = 'chronicle/set';
  const data = 
  {
    guild: 
    {
      id: guild.id,
      name: guild.name,
      owner_id: guild.ownerId,
      bot: guild.client.user.id,
      shard: guild.shardId,
      icon_url: guild.iconURL() ?? '',
    }
  }
  
  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Updated
      return true;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}