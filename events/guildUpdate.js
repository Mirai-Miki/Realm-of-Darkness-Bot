'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

module.exports = {
	name: Events.GuildUpdate,
	once: false,
	async execute(oldGuild, newGuild) {
		try
		{
			await setActivity(newGuild.client);
			await API.updateGuild(newGuild);
		}
		catch (error)
		{
			try
			{
				if (!error.discordResponse) // Not a RoD Error, we need to debug
				{
					const rodError = new RealmError({cause: error.stack});
					error.discordResponse = rodError.discordResponse;
					error.debug = rodError.debug;
				}
				handleErrorDebug(error, oldGuild.client);
			}
			catch (e)
			{
				console.error(`Error at guildUpdate()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};