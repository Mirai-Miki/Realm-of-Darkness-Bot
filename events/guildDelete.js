'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
		await setActivity(guild.client);
		await API.deleteGuild(guild.id);
	},
};