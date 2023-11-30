'use strict';
const { Events } = require('discord.js');
const setActivity = require('../modules/setActivity');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildUpdate,
	once: false,
	async execute(oldGuild, newGuild) {
		await setActivity(newGuild.client);
		await API.updateGuild(newGuild);
	},
};