'use strict';
module.exports = {
	name: 'shardDisconnect',
	once: false,
	execute(closeEvent, id) {
        console.log(
            "The Shard was disconnected.\n" +
            `Shard ${String(id)} disconnected.\n` +
            `Code: ${String(closeEvent.code)}\n` +
            `Reason: ${closeEvent.reason}`
        )
	},
};