'use strict';
const newSlashCommand = require('../../modules/Tracker/slashCommands.js')

module.exports = {
	data: newSlashCommand('new'),      
	
	async execute(interaction) {
		switch (interaction.options.getSubcommand())
        {
            case 'roll':
                const roll = new WoD5thRoll(interaction);
                if (roll.isArgsValid())
                {
                    roll.roll();
                    roll.constructEmbed();
                    roll.constructContent();
                    roll.constructInteractions();
                    await roll.reply();
                }
                break;
            case 'resonance':
                const resRoll = new Resonance(interaction);
                resRoll.roll();
                resRoll.constructEmbed();
                resRoll.reply();
                break;
            case 'rouse':
                const rouseRoll = new Rouse(interaction);
                rouseRoll.roll();
                rouseRoll.constructEmbed();
                await rouseRoll.reply();
                break;
            case 'general':
                const generalRoll = new GeneralRoll(interaction);
                if (generalRoll.isArgsValid())
                {
                    generalRoll.roll();
                    generalRoll.contructEmbed();
                    generalRoll.reply();
                }
                break;
        }
	}
};