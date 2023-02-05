'use strict';

module.exports = async function getSupporterLevel(user)
{
  const path = 'bot/user/supporter/get';
  const data = 
  {
    user_id: user.id,
  };
        
  let res = await postData(path, data);
  if (res?.status === 200 && res?.data)
  {
    return res.data.level;
  }
  else
  {
    console.error("Error in DatabaseAPI.getCharacter()")
    console.error(`Status: ${res?.status}`)
    return undefined;
  }
}