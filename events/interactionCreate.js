'use strict';
const { Events } = require('discord.js');
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');
const API = require('../realmAPI');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) 
	{
    if (interaction.isCommand())
		{
			const client = interaction.client;
      const command = client.commands.get(interaction.commandName);
	    if (!command) return;

	    try 
			{
				await API.updateUser(
					interaction.member ? interaction.member : interaction.user, true);
	    	const discordResponse = await command.execute(interaction);
				if (discordResponse)
				{
					if (!interaction.replied && !interaction.deferred) 
						interaction.reply(discordResponse);
					else interaction.editReply(discordResponse);
				}
				else throw new Error("No discordResponse");
	    } 
			catch (error)
			{
				try
				{
					if (!error.discordResponse) // Not a RoD Error, we need to debug
					{
						const rodError = new RealmError({cause: error.stack});
						error.discordResponse = rodError.discordResponse;
						error.debug = rodError.debug;
					}
					
					if (!interaction.replied && !interaction.deferred) 
						interaction.reply(error.discordResponse);
					else interaction.editReply(error.discordResponse);					
					handleErrorDebug(error, interaction);
				}
				catch (e)
				{
					console.error(`Error at interactionCreate() - Command`);
					console.error(e);
					console.error(`\n\nError that triggered this:`);
					console.error(error)
				}
	    }
		}
		else if (interaction.isMessageComponent())
		{
			interaction.splitId = interaction.customId.split('|');
			const id = interaction.splitId[0];
			const component = interaction.client.components?.get(id);
			if (!component) return;

			try 
			{
	    	const discordResponse = await component.execute(interaction);
				if (discordResponse)
				{
					if (!interaction.replied && !interaction.deferred) 
						interaction.reply(discordResponse);
					else interaction.editReply(discordResponse);
				}
				else throw new Error("No discordResponse");
	    } 
			catch (error)
			{
				try
				{
					if (!error.discordResponse) // Not a RoD Error, we need to debug
					{
						const rodError = new RealmError({cause: error.stack});
						error.discordResponse = rodError.discordResponse;
						error.debug = rodError.debug;
					}
					
					if (!interaction.replied && !interaction.deferred) 
						interaction.reply(error.discordResponse);
					else interaction.editReply(error.discordResponse);					
					handleErrorDebug(error, interaction);
				}
				catch (e)
				{
					console.error(`Error at interactionCreate() - Component`);
					console.error(e);
					console.error(`\n\nError that triggered this:`);
					console.error(error)
				}
	    }
		}        
	},
};