"use strict";
require('dotenv').config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

function pushCommands(ver, toggle = true) {
  const clientId = process.env[`CLIENT_ID_${ver.toUpperCase()}`];
  const token = process.env[`TOKEN_${ver.toUpperCase()}`];
  const guildId = process.env.DEV_SERVER_ID;
  const commandPath = path.join(__dirname, "../src/commands", ver.toLowerCase());
  const commands = [];
  const commandFiles = fs
    .readdirSync(`${commandPath}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`${commandPath}/${file}`);
    commands.push(command.data);
    console.log(`${commandPath}/${file}:`, command.data?.name);
  }

  const rest = new REST({ version: "10" }).setToken(token);

  (async () => {
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: toggle ? commands : [],
      });
      console.log(`Commands ${ver} ${toggle ? '‘registered’' : '‘deleted’'} successfully.`);
    } catch (error) {
      console.error(error);
    }
  })();
}

pushCommands("5th", false);
pushCommands("20th", false);
pushCommands("Cod", false);