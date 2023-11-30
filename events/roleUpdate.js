'use strict';
const { Events, PermissionFlagsBits } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildRoleUpdate,
	once: false,
	async execute(oldRole, newRole) {
		if (!oldRole.permissions.has(PermissionFlagsBits.Administrator) &&
			!newRole.permissions.has(PermissionFlagsBits.Administrator)) return;

		for (const member of newRole.members.values()) {
			await API.updateUser(member);
		}
	},
};