'use strict';
const { trackerSlashCommands, trackerExecute} = 
    require('../../../modules/Tracker/commands/slashCommands')

module.exports = {
	data: trackerSlashCommands(),      
	
	async execute(interaction) { await trackerExecute(interaction); }
};