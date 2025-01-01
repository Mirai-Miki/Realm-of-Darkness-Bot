"use strict";
const { postData } = require("./postData.js");
const { RealmAPIError, APIErrorCodes } = require("../Errors");

/**
 * Takes in a character and saves the information to the Database
 * @param {Character} character The character class being saved
 * @returns Returns true on save or throws an Error if not.
 */
module.exports = async function saveCharacter(cData) {
  {
    const path = "character/save";
    const res = await postData(path, cData);
    switch (res?.status) {
      case 200: // Saved successfully
        return true;
      case 406: // Image provided is not valid
        throw new RealmAPIError({ code: APIErrorCodes.NotAnImage });
      case 304: // Not Modified - Too many sheets
        throw new RealmAPIError({ code: APIErrorCodes.TooManySheets });
      default:
        throw new RealmAPIError({
          cause: `res_status: ${res?.status}\nres: ${JSON.stringify(
            res?.data,
            null,
            2
          )}\npost: ${JSON.stringify(cData, null, 2)}`,
        });
    }
  }
};
