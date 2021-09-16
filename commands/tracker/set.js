'use strict';
const { setCommand } = require('../../modules/Tracker/slashCommands/slashCommands.js');
const execute = require('../../modules/Tracker/executeCommand.js');

module.exports = {
	data: setCommand(),      
	
	async execute(interaction) {
        await execute(interaction);
	}
};