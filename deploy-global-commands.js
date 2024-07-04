"use strict";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

function pushCommands(ver) {
  const config = require("./config.json");
  const clientId = config["clientId" + ver];
  const token = config["token" + ver];
  const commandPath = `./commands/${ver.toLowerCase()}`;

  const commands = [];

  const commandFiles = fs
    .readdirSync(`${commandPath}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`${commandPath}/${file}`);
    commands.push(command.data);
  }

  const rest = new REST({ version: "10" }).setToken(token);

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });

      console.log(`Successfully registered ${ver} application commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
}

pushCommands("5th");
pushCommands("20th");
pushCommands("Cod");
