"use strict";
const Axios = require("axios");
const { APIKey, dev } = require("../config.json");
const { APIErrorCodes, RealmAPIError } = require("../Errors");

/**
 * Sends a POST request to the specified path with the provided data.
 *
 * @param {string} path - The path to send the POST request to.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise<object>} - A promise that resolves to the response object.
 * @throws {RealmAPIError} - If there is an error during the request.
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
    const port = dev ? 8080 : 80;
    const res = await Axios.post(
      `http://127.0.0.1:${port}/bot/${path}`,
      data,
      config
    );
    delete data.APIKey;
    return res;
  } catch (error) {
    delete data.APIKey;
    if (error.code === "ECONNREFUSED")
      throw new RealmAPIError({
        cause: error.stack,
        code: APIErrorCodes.ConnectionRefused,
      });
    else
      throw new RealmAPIError({
        cause: error.stack + `\n\nData:\n${JSON.stringify(data)}`,
      });
  }
};
