'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const updateAllGuilds = require('../modules/updateAllGuilds');
const API = require('../realmAPI');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try
		{
			await setActivity(client);
			setInterval(() => {setActivity(client)}, 300000);
			await API.updateBot(client);
			await updateAllGuilds(client);		
		}
		catch(error)
		{
			console.error("Error in ready.js");
			console.error(error);
		}
		console.log(`Connected as: ${client.user.tag} || Shard: ${client.shard?.ids}`);
	},
};