'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		try
		{
			await API.deleteMember(member.id, member.guild.id);
		}
		catch(error)
		{
			console.error("Error in guildMemberRemove.js");
			console.error(error);
		}
	},
};