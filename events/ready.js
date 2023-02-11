'use strict';
const { setActivity } = require('../modules');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Connected as: ${client.user.tag}`);
    setActivity(client);
		setInterval(() => {setActivity(client)}, 300000);
	},
};