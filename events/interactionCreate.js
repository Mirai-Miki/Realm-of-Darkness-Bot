'use strict';
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
        if (!interaction.isCommand()) return;
        
        const client = interaction.client;
        const command = client.commands.get(interaction.commandName);

	    if (!command) return console.log("No Interaction");

	    try {
	    	await command.execute(interaction);
	    } catch (error) {
	    	console.error(error);
	    	await interaction.reply(
            { 
                content: 'There was an error while executing this command!\n' +
                    'If see this error please let Mirai-Miki#6631 know.', 
                ephemeral: true 
            });
	    }
	},
};