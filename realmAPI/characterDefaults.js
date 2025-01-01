"use strict";
const { postData } = require("./postData.js");
const { RealmAPIError, RealmError, ErrorCodes } = require("../Errors/");

module.exports.get = async function (guildId, userId) {
  const path = "chronicle/member/defaults/get";
  const data = {
    guild_id: guildId,
    user_id: userId,
  };

  const res = await postData(path, data);
  switch (res?.status) {
    case 200: // Updated
      const data = res.data;
      data.autoHunger = data.auto_hunger;
      delete data.auto_hunger;
      return data;
    case 204: // No defaults
      return null;
    default:
      throw new RealmAPIError({
        cause: `res_status: ${res?.status}\nmessage: ${JSON.stringify(
          res.data,
          null,
          2
        )}\npost: ${JSON.stringify(data, null, 2)}`,
      });
  }
};

module.exports.set = async function (
  guildId,
  userId,
  name,
  autoHunger,
  disable
) {
  const path = "chronicle/member/defaults/set";
  const data = {
    user_id: userId,
    guild_id: guildId,
    name: name,
    auto_hunger: autoHunger,
    disable: disable,
  };

  const res = await postData(path, data);
  switch (res?.status) {
    case 200: // Updated
      return;
    case 204: // No Character
      throw new RealmError({ code: ErrorCodes.NoCharacter });
    default:
      throw new RealmAPIError({
        cause: `res_status: ${res?.status}\nres: ${JSON.stringify(
          res?.data,
          null,
          2
        )}\npost: ${JSON.stringify(data, null, 2)}`,
      });
  }
};
