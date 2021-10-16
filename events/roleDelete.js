'use strict';
const DatabaseAPI = require('../modules/util/DatabaseAPI')

module.exports = {
	name: 'roleDelete',
	once: false,
	async execute(role) 
    {
        console.log(role.name)
        DatabaseAPI.DeleteSTRole(role);
	},
};