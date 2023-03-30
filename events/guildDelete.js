'use strict';
const { Events } = require('discord.js');
const { setActivity } = require('../modules');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
    setActivity(guild.client);
		await API.deleteGuild(guild.id);
	},
};