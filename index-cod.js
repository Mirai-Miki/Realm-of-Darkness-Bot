'use strict';
const { ShardingManager } = require('discord.js');
const { token } = require('./configCoD.json');

const manager = new ShardingManager('./cod-bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();