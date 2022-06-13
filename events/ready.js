'use strict';
const setActivity = require('../modules/util/setActivity.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log("Connected as: " + client.user.tag);
        setActivity(client);
		setInterval(updateActivity, 3600000);
	},
};

function updateActivity(client)
{
	setActivity(client);
}