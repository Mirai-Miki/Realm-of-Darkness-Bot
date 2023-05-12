'use strict';
const { Events, PermissionFlagsBits } = require('discord.js');
const API = require('../realmAPI')
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

module.exports = {
	name: Events.GuildRoleCreate,
	once: false,
	async execute(role) 
  {
    if (!role.permissions.has(PermissionFlagsBits.Administrator)) return;

		try
		{
			for (const member of role.members.values())
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
				handleErrorDebug(error, role.client);
			}
			catch (e)
			{
				console.error(`Error at roleCreate()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};