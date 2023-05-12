'use strict';
const { Events, PermissionFlagsBits } = require('discord.js');
const API = require('../realmAPI')

module.exports = {
	name: Events.GuildRoleUpdate,
	once: false,
	async execute(oldRole, newRole) 
  {
    if (!oldRole.permissions.has(PermissionFlagsBits.Administrator) &&
      !newRole.permissions.has(PermissionFlagsBits.Administrator)) return;
  
		try
		{
			for (const member of newRole.members.values())
			{
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
				handleErrorDebug(error, newRole.client);
			}
			catch (e)
			{
				console.error(`Error at roleUpdate()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};