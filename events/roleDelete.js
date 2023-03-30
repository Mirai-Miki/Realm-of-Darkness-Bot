'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI')

module.exports = {
	name: Events.GuildRoleDelete,
	once: false,
	async execute(role) 
  {
    await API.deleteStRole(role);
	},
};