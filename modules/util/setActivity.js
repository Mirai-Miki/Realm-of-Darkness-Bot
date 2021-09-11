'use strict';
module.exports = function (client) 
{
	let userCount = 0;
    client.guilds.cache.each(guild => userCount += guild.memberCount);
    client.user.setActivity(`${client.guilds.cache.size} Chronicles and` +
        ` ${userCount} Players | Type /rod for a list of commands`, 
        { type: 'WATCHING' });
}