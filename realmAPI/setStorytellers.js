'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');

module.exports = async function setStorytellers(guildId, roleId)
{
  const path = 'chronicle/storyteller/roles/set';
  const data = 
  {
    guild_id: guildId,
    role_id: roleId
  }

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Updated
      return res.data.roleIds;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
  }
}