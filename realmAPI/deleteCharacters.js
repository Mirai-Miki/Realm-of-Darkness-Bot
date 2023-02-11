'use strict';
const { postData } = require('./postData.js');
const { APIKey } = require('../config5th.json');
const RealmAPIError = require('../Errors/RealmAPIError');


module.exports = async function getCharacter(ids, disconnect=false)
{
    const path = `character/delete`;
    const data = {
        APIKey: APIKey,
        ids: ids,
        disconnect: disconnect
    }

    const res = await postData(path, data);
    switch(res?.status)
    {
      case 200: // Deleted 
        return res.data.names;
      default:
        throw new RealmAPIError({cause: `res: ${res?.status}\ndata: ${res?.data}`});
    }
}