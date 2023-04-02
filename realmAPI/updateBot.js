'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');

module.exports = async function updateBot(client)
{
  if (!client.shard.ids.includes(0)) return;
  const path = 'data/set';
  const data = 
  {
    bot: 
    {
      id: client.user.id,
      username: client.user.username,
      discriminator: client.user.discriminator,
      avatar_url: client.user.displayAvatarURL(),
      shard_count: client.shard.count,
    }
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Updated
      return true;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}