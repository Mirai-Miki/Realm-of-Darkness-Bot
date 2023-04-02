'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
		try
		{
			await setActivity(guild.client);
			await API.deleteGuild(guild.id);
		}
		catch(error)
		{
			console.error("Error in guildDelete.js");
			console.error(error);
		}
	},
};