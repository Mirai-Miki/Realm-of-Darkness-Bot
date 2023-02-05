'use strict';

module.exports = async function diceStatsUpdate(user, version, result, reroll)
{
  const path = 'bot/dice/stats/update';
  const data = 
  {
    user: user,
    version: version,
    result: result,
    reroll: reroll,
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