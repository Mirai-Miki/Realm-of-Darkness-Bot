'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const RealmAPIError = require('../Errors/RealmAPIError');

module.exports = async function getTrackerChannel(guildId)
{
  const path = 'chronicle/channel/get';
  const data = {
    APIKey: APIKey,
    guild_id: guildId
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Updated
      return res.data.channel_id;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}