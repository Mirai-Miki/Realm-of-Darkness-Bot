'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const updateAllGuilds = require('../modules/updateAllGuilds');
const API = require('../realmAPI');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
    setActivity(client);
		setInterval(() => {setActivity(client)}, 300000);
		await API.updateBot(client);
		await updateAllGuilds(client);		
		console.log(`Connected as: ${client.user.tag}`);
	},
};