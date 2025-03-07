"use strict";
require(`${process.cwd()}/alias`);
const { postData } = require("./postData.js");
const RealmAPIError = require("@src/errors/RealmAPIError.js");

module.exports = async function deleteInitTracker(channelId) {
  const path = `initiative/delete`;
  const data = { channel_id: channelId };

  const res = await postData(path, data);
  switch (res?.status) {
    case 200: // Deleted
      return;
    case 204: // nothing to delete
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
