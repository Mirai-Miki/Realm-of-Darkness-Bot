'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI')

module.exports = {
	name: Events.GuildRoleDelete,
	once: false,
	async execute(role) 
  {
		try
		{
			await API.deleteStRole(role.id);
		}
		catch(error)
		{
			console.error("Error in roleDelete.js")
			console.error(error);
		}
	},
};