'use strict';
const { ShardingManager } = require('discord.js');
const { token } = require('./config5th.json');

const manager = new ShardingManager('./v5-bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();