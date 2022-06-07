'use strict';
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
        if (interaction.isCommand())
		{
			const client = interaction.client;
        	const command = client.commands.get(interaction.commandName);

	    	if (!command) return;

	    	try {
	    		await command.execute(interaction);
	    	} catch (error) {
				console.error("\n\nError at interactionCreate.js isCommand()");
	    		console.error(error);
	    		await interaction.editReply(
        	    { 
        	        content: 'There was an error while executing this command!\n' +
        	            'If see this error please report it at the ' +
						'[Realm of Darkness Server](<https://discord.gg/Qrty3qKv95>).', 
        	        ephemeral: true 
        	    });
	    	}
		}
		else if (interaction.isMessageComponent())
		{
			const customId = interaction.customId;
			const component = interaction.client.components?.get(customId);
			if (!component) return;

			try {
	    		await component.execute(interaction);
	    	} catch (error) {
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