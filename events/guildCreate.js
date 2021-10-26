'use strict';
const setActivity = require('../modules/util/setActivity.js');

module.exports = {
	name: 'guildCreate',
	once: false,
	execute(guild) {
        setActivity(guild.client);
	},
};