'use strict';
const { postData } = require('./postData.js');
const RealmAPIError = require('../Errors/RealmAPIError');


module.exports = async function deleteStRole(roleId)
{
  const path = `chronicle/storyteller/roles/delete`;
  const data = {role_id: roleId}

  const res = await postData(path, data);
  switch(res?.status)
  {
    case 200: // Deleted 
      return true;
    case 204:
      return false;
    default:
      throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${JSON.stringify(data)}`});
  }
}