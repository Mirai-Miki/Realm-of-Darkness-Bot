'use strict';
const { setActivity } = require('../modules');

module.exports = {
	name: 'guildDelete',
	once: false,
	execute(guild) {
    setActivity(guild.client);
	},
};