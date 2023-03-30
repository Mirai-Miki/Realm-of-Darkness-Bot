'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(guild) {
    setActivity(guild.client);
		await API.updateGuild(guild);
	},
};