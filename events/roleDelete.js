'use strict';
const DatabaseAPI = require('../databaseAPI/DatabaseAPI')

module.exports = {
	name: 'roleDelete',
	once: false,
	async execute(role) 
    {
        DatabaseAPI.DeleteSTRole(role);
	},
};