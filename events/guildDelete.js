'use strict';
const setActivity = require('../modules/util/setActivity.js');

module.exports = {
	name: 'guildDelete',
	once: false,
	execute(guild) {
        setActivity(guild.client);
	},
};