'use strict';

/**
 * Sets the supporter level in the database for a User
 * @param {User} user 
 * @param {number} level
 * @returns 
 */
module.exports = async function setSupporterLevel(user, level)
{
  const path = 'bot/user/supporter/set';
  const data = 
  {
    user: {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar_url: user.avatarURL() ?? '',
      },
    level: level
  };
  
  let res = await postData(path, data);
  if (res?.status === 200 && res?.data)
  {
    return res.data;
  }
  else
  {
    console.error("Error in DatabaseAPI.getCharacter()")
    console.error(`Status: ${res?.status}`)
    return undefined;
  }
}