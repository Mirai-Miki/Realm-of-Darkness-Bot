'use strict';
const { APIKey } = require('../config5th.json');
const { postData } = require('./postData');

module.exports = async function getSupporterLevel(userId)
{
  const path = 'user/supporter/get';
  const data = 
  {
    APIKey: APIKey,
    user_id: userId,
  };
        
  let res = await postData(path, data);
  switch(res?.status)
    {
      case 200: // Fetched level
        return res.data.level;
      case 204: // No User
        return 0;
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
    }
}