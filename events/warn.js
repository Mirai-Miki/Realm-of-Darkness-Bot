'use strict';
module.exports = {
	name: 'warn',
	once: false,
	execute(info) {
        console.log(
            `The RoD Bot - Encounted a Warning.\n` +
            `Message: ${info}\n\n`
        );
	},
};