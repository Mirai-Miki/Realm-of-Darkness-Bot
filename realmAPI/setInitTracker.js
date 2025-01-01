"use strict";
const { postData } = require("./postData.js");
const RealmAPIError = require("../Errors/RealmAPIError");

module.exports = async function setInitTracker(channelId, guildId, tracker) {
  const path = `initiative/set`;
  const data = {
    channel_id: channelId,
    chronicle_id: guildId,
    tracker: tracker,
  };

  const res = await postData(path, data);
  switch (res?.status) {
    case 200:
      return;
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
