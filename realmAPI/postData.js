'use strict';
const Axios = require('axios');
const { APIKey } = require('../config5th.json');
const { APIErrorCodes, RealmAPIError } = require('../Errors');

/**
 * 
 * @param {string} path 
 * @param {Object} data 
 * @returns 
 */
module.exports.postData = async (path, data) =>
{
  const config = {
    headers: {'Content-Type': 'application/json'},
    validateStatus: (status) => status >= 200 && status < 500
  };
  data.APIKey = APIKey
    
  try
  {
    return await Axios.post(`http://127.0.0.1/bot/${path}`, data, config);
  }
  catch (error)
  {
    if (error.code === 'ECONNREFUSED')
      throw new RealmAPIError({
        cause: error.stack, 
        code: APIErrorCodes.ConnectionRefused
      });
    else if (error.code === 'ECONNRESET')
    { // Socket Hang up.
      console.error("hung up")
      return await Axios.post(`http://localhost/bot/${path}`, data, config);
    }
    else throw new RealmAPIError({cause:error.stack + `\n\nData:\n${JSON.stringify(data)}}`});
  }
}