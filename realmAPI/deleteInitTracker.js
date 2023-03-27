'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');


module.exports = async function deleteInitTracker(channelId)
{
  const path = `initiative/delete`;
  const data = {channel_id: channelId}

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Deleted 
      return;
    case 204: // nothing to delete
      return;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}