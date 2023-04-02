'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');

module.exports = async function setTrackerChannel(guildId, channelId)
{
  const path = 'chronicle/channel/set';
  const data = {
    guild_id: guildId,
    channel_id: channelId
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Updated
      return res.data.channel_id;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}