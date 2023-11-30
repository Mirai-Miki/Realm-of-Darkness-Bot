'use strict';
const { Events, PermissionFlagsBits } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildRoleDelete,
	once: false,
	async execute(role) {
		const deleted = await API.deleteStRole(role.id);
		if (!deleted && !role.permissions.has(PermissionFlagsBits.Administrator))
			return;

		const ids = await API.getAdminsStorytellers(role.guild.id);
		for (const id of ids.members) {
			const member = await role.guild.members.fetch(id);
			await API.updateUser(member);
		}
	},
};