'use strict';
const Axios = require('axios');

/*
Posts data to the selected host
Return: Undefined on error or response on success
*/
module.exports.postData = async (host, data) =>
{
    const config = {headers: {'Content-Type': 'application/json'}};
    
    try
    {
        return await Axios.post(host, data, config);
    }
    catch (error)
    {
        if (error.code === 'ECONNREFUSED')
        {
            console.error("Error Database refused connection.\nCode: " +
                "ECONNREFUSED")
        }
        else console.error(error);
        return undefined;
    }
}