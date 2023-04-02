'use strict'
const { postData } = require('./postData.js');

module.exports = async function getSTRoles(guildId)
{
  const path = 'chronicle/storyteller/roles/get'

  const data = {guild_id: guildId}

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Found Roles  
      return res.data.roles;
    case 204: // No Roles set
      return [];
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}