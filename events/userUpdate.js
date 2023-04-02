'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');

module.exports = {
	name: Events.UserUpdate,
	once: false,
	async execute(oldUser, newUser) {
		try
		{
			if (newUser.partial) await newUser.fetch();
			await API.updateUser(newUser);
		}
		catch(error)
		{
			console.error("Error in userUpdate.js");
			console.error(error);
		}
	},
};