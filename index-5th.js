"use strict";
const { ShardingManager } = require("discord.js");
const { token5th } = require("./config.json");

const manager = new ShardingManager("./v5-bot.js", {
  token: token5th,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();
