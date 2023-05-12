'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(oldMember, newMember) {
		try
		{
			if (newMember.partial) await newMember.fetch();
			await API.updateUser(newMember);
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
				handleErrorDebug(error, oldMember.client);
			}
			catch (e)
			{
				console.error(`Error at guildMemberUpdate()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};