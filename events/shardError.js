'use strict';
module.exports = {
	name: 'shardError',
	once: false,
	execute(error, id) {
        console.error(
            "The Shard encountered an Error.\n" +
            `Shard ${String(id)} encounted an error.\n` +
            `Name: ${error.name}\n` +
            `Message: ${error.message}`
        );
	},
};