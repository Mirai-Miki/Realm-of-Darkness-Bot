'use strict';
const DatabaseAPI = require('../realmAPI/DatabaseAPI')

module.exports = {
	name: 'roleDelete',
	once: false,
	async execute(role) 
  {
    DatabaseAPI.DeleteSTRole(role);
	},
};