'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		try
		{
			await API.deleteMember(member.id, member.guild.id);
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
				await handleErrorDebug(error, member.client);
			}
			catch (e)
			{
				console.error(`Error at guildMemberRemove()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};