"use strict";
const { postData } = require("./postData.js");
const { RealmAPIError, APIErrorCodes } = require("../Errors");

module.exports = async function newCharacter(data) {
  {
    const path = data.character.class ? "character/new" : `character/new_old`;
    const res = await postData(path, data);
    switch (res?.status) {
      case 201: // Saved successfully
        return;
      case 304: // Not Modified -- existing character
        throw new RealmAPIError({ code: APIErrorCodes.CharacterExists });
      case 406: // Image provided is not valid
        throw new RealmAPIError({ code: APIErrorCodes.NotAnImage });
      case 409: // Conflict -- Too many characters
        throw new RealmAPIError({ code: APIErrorCodes.CharacterLimitReached });
      default:
        throw new RealmAPIError({
          cause: `code: ${res?.status}\npost: ${JSON.stringify(
            data
          )}\nJSON: ${JSON.stringify(res?.data)}`,
        });
    }
  }
};
