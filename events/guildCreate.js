'use strict';
const { setActivity } = require('../modules');

module.exports = {
	name: 'guildCreate',
	once: false,
	execute(guild) {
    setActivity(guild.client);
	},
};