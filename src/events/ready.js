'use strict';
require(`${process.cwd()}/alias`);
const { Events } = require('discord.js');
const setActivity = require("@modules/setActivity");
const updateAllGuilds = require("@modules/updateAllGuilds");
const API = require("@api");


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await API.updateBot(client);
		await updateAllGuilds(client);
		console.log(`Connected as: ${client.user.tag} || Shard: ${client.shard?.ids} || Guilds: ${client.guilds.cache.size}`);
		await setActivity(client);
		setInterval(() => { setActivity(client) }, 300000);
	},
};