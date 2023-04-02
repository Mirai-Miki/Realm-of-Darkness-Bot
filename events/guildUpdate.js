'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildUpdate,
	once: false,
	async execute(guild) {
		try
		{
			await setActivity(guild.client);
			await API.updateGuild(guild);
		}
		catch (error)
		{
			console.error("Error in guildUpdate.js");
			console.error(error);
		}
	},
};