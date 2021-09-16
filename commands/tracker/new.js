'use strict';
const { newCommand } = require('../../modules/Tracker/slashCommands/slashCommands.js');
const execute = require('../../modules/Tracker/executeCommand.js');

module.exports = {
	data: newCommand(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};