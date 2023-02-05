'use strict';
const RealmError = require('../Errors/RealmError');
const { handleErrorDebug } = require('../Errors/index');

module.exports = {
	name: 'interactionCreate',
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
	    	const discordResponse = await command.execute(interaction);
				if (discordResponse)
				{
					if (!interaction.replied && !interaction.deferred) 
						interaction.reply(discordResponse);
					else interaction.editReply(discordResponse);
				}
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
					console.error(`Error at interactionCreate()`);
					console.error(e);
					console.error(`\n\nError that triggered this:`);
					console.error(error)
				}
	    }
		}
		else if (interaction.isMessageComponent())
		{
			const customId = interaction.customId;
			const component = interaction.client.components?.get(customId);
			if (!component) return;

			try 
			{
	    	await component.execute(interaction);
	    } 
			catch (error) 
			{
				console.error("\n\nError at interactionCreate.js isMessageComponent()");
	    	console.error(error);
	    	await interaction.editReply(
        { 
        	content: 'There was an error while executing this component!\n' +
        	  'If see this error please report it at the ' +
						'[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).', 
        	  ephemeral: true 
        });
	    }
		}        
	},
};