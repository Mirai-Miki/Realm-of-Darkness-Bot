'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');
const { InitiativeTracker } = require('../structures');

module.exports = async function getInitTracker(channelId)
{
  const path = 'initiative/get';
  const data =  {channel_id: channelId};

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found a Tracker
      return new InitiativeTracker({json: res.data.tracker});
    case 204: // No Tracker
      return null;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}