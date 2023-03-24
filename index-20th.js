'use strict';
const { ShardingManager } = require('discord.js');
const { token } = require('./config20th.json');

const manager = new ShardingManager('./v20-bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();