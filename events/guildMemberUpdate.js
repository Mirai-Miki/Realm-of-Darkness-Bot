'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(oldMember, newMember) {
    if (newMember.partial) await newMember.fetch();
		await API.updateUser(newMember);
	},
};