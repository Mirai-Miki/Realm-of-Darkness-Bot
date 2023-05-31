'use strict';
const { Events } = require('discord.js');
const API = require('../realmAPI');
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

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
			try
			{
				if (!error.discordResponse) // Not a RoD Error, we need to debug
				{
					const rodError = new RealmError({cause: error.stack});
					error.discordResponse = rodError.discordResponse;
					error.debug = rodError.debug;
				}
				await handleErrorDebug(error, oldUser.client);
			}
			catch (e)
			{
				console.error(`Error at userUpdate()`);
				console.error(e);
				console.error(`\n\nError that triggered this:`);
				console.error(error)
			}
		}
	},
};