"use strict";
const Axios = require("axios");
const { APIKey } = require("../config5th.json");
const { APIErrorCodes, RealmAPIError } = require("../Errors");

/**
 *
 * @param {string} path
 * @param {Object} data
 * @returns
 */
module.exports.postData = async (path, data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: (status) => status >= 200 && status < 500,
  };
  data.APIKey = APIKey;

  try {
    const res = await Axios.post(`http://127.0.0.1/bot/${path}`, data, config);
    delete data.APIKey;
    return res;
  } catch (error) {
    delete data.APIKey;
    if (error.code === "ECONNREFUSED")
      throw new RealmAPIError({
        cause: error.stack,
        code: APIErrorCodes.ConnectionRefused,
      });
    else console.error("\n\n New Realm Error\n" + error.stack);
    console.error("\nResponse:\n" + res);
    throw new RealmAPIError({
      cause: error.stack + `\n\nData:\n${JSON.stringify(data)}`,
    });
  }
};
