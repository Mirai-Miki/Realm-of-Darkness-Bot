"use strict";
const { postData } = require("./postData.js");
const RealmAPIError = require("../Errors/RealmAPIError");

module.exports = async function deleteMember(memberId, guildId) {
  const path = `chronicle/member/delete`;
  const data = { member_id: memberId, guild_id: guildId };

  const res = await postData(path, data);
  switch (res?.status) {
    case 200: // Deleted
      return;
    case 204:
      return; // nothing to delete
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
