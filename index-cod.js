"use strict";
const { ShardingManager } = require("discord.js");
const { tokenCod } = require("./config.json");

const manager = new ShardingManager("./cod-bot.js", {
  token: tokenCod,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
