"use strict";
const { ShardingManager } = require("discord.js");
const { token20th } = require("./config.json");

const manager = new ShardingManager("./v20-bot.js", {
  token: token20th,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
