'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const RealmAPIError = require('../Errors/RealmAPIError');
const { serializeGuild } = require('./serializers');


module.exports = async function updateGuild(guild, roleId)
{
  const path = 'chronicle/set';
  const data = {
    APIKey: APIKey,
    guild: serializeGuild(guild),
    role_id: roleId
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