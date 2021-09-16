'use strict';
const { updateCommand } = require('../../modules/Tracker/slashCommands/slashCommands.js');
const execute = require('../../modules/Tracker/executeCommand.js');

module.exports = {
	data: updateCommand(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};