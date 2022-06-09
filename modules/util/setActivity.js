'use strict';
module.exports = function (client) 
{
    client.user.setActivity(`${client.guilds.cache.size} Chronicles`, 
        { type: 'WATCHING' });
}