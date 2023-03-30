'use strict';
const { ActivityType } = require('discord.js')

module.exports = async function setActivity(client) 
{
  const guildSizes = await client.shard.fetchClientValues('guilds.cache.size');
  const size = guildSizes.reduce(
    ((accumulator, currentValue) => accumulator + currentValue), 0
  );
  
  client.user.setActivity({ 
    name: `${size} Chronicles`, 
    type: ActivityType.Watching, 
    shard: client.shard.ids 
  });
}