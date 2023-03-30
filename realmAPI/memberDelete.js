'use strict';

module.exports = async function memberDelete(member)
{
  const path = 'bot/member/delete';
  const data = 
  {
    user_id: member.id,
    guild_id: member.guild.id,
  };
  
  let res = await postData(path, data);
  if (res?.status === 200 && res?.data) return res.data;
  else
  {
    console.error("Error in DatabaseAPI.getCharacter()")
    console.error(`Status: ${res?.status}`)
    return undefined;
  }
}