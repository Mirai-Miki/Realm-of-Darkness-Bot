'use strict';
const Axios = require('axios');
const { APIKey } = require('../config5th.json');
const RealmAPIError = require('../Errors/RealmAPIError');
const { APIErrorCodes } = require('../Errors/index');

/**
 * 
 * @param {string} path 
 * @param {Object} data 
 * @returns 
 */
module.exports.postData = async (path, data) =>
{
  const config = {headers: {'Content-Type': 'application/json'}};
  data.APIKey = APIKey
    
  try
  {
    return await Axios.post(`http://localhost:80/bot/${path}`, data, config);
  }
  catch (error)
  {
    if (error.code === 'ECONNREFUSED') 
      throw new RealmAPIError({
        cause: error.stack, 
        type: APIErrorCodes.ConnectionRefused
      });
    else throw new RealmAPIError({cause:error.stack});
  }
}