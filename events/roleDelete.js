'use strict';
const DatabaseAPI = require('../modules/util/DatabaseAPI')

module.exports = {
	name: 'roleDelete',
	once: false,
	async execute(role) 
    {
        DatabaseAPI.DeleteSTRole(role);
	},
};