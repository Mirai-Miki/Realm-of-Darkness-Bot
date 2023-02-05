'use strict'
const { EmbedBuilder } = require("discord.js");

module.exports.ErrorCodes = 
{
  RealmError: 0,
  DiscordAPIError: 1,
  InvalidGeneralRollSets: 2,
  InvalidGeneralRollDice: 3,
	GuildRequired: 4
}

module.exports.APIErrorCodes =
{
  RealmAPIError: 1000,
  ConnectionRefused: 1001,
	CharacterExists: 1002,
}

module.exports.RealmError = require('./RealmError');
module.exports.RealmAPIError = require('./RealmAPIError');

module.exports.handleErrorDebug = async function(error, interaction)
{	
	if (!error.debug.raise) return;

  if (process.platform === 'win32')
	{ // Print to console on dev enviorment
		console.error(error);
		return;
	}

	try
	{
    console.log(error.cause)
		const debugChannel = 
			await interaction.client.channels.fetch('776761322859266050');

		const debugEmbed = new EmbedBuilder()
			.setTitle(error.name)
			.setColor('#db0f20')
		
		let description = error.stack;		
		if (error.debug.cause) description += `\n\nCaused by:\n${error.cause}`;		
		debugEmbed.setDescription(description)
		debugChannel.send({embeds:[debugEmbed]})
	}	
	catch (e)
	{
		console.error(error);
    console.error('\nPrinting to console because of Error:')
    console.log(e);
	}
}