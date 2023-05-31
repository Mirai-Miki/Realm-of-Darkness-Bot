'use strict';
const { Events, PermissionFlagsBits } = require('discord.js');
const API = require('../realmAPI')
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

module.exports = {
	name: Events.GuildRoleDelete,
	once: false,
	async execute(role) 
  {
		try
		{
			const deleted = await API.deleteStRole(role.id);
			if (!deleted && !role.permissions.has(PermissionFlagsBits.Administrator))
				return;

			const ids = await API.getAdminsStorytellers(role.guild.id);			
			for (const id of ids.members)
			{
				const member = await role.guild.members.fetch(id);
				await API.updateUser(member);
			}
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
				await handleErrorDebug(error, role.client);
				console.error("Error in Role Delete - GuildId:", role.guild.id)
			}
			catch (e)
			{
				console.error(`Error at roleDelete()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};