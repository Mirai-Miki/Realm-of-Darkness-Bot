'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const updateAllGuilds = require('../modules/updateAllGuilds');
const API = require('../realmAPI');
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

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
			try
			{
				if (!error.discordResponse) // Not a RoD Error, we need to debug
				{
					const rodError = new RealmError({cause: error.stack});
					error.discordResponse = rodError.discordResponse;
					error.debug = rodError.debug;
				}
				handleErrorDebug(error, client);
			}
			catch (e)
			{
				console.error(`Error at ready()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
		console.log(`Connected as: ${client.user.tag} || Shard: ${client.shard?.ids}`);
	},
};