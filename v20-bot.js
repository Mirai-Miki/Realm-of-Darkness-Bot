"use strict";
const fs = require("fs");
const { token20th } = require("./config.json");
const { handleErrorDebug } = require("./Errors");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.GuildMember, Partials.User],
});

/* Loading Commands in Client */
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands/20th")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/20th/${file}`);
  client.commands.set(command.data.name, command);
}

/* Loading Component Events in Client */
client.components = new Collection();
const componentFiles = fs
  .readdirSync("./components/20th")
  .filter((file) => file.endsWith(".js"));
for (const file of componentFiles) {
  const component = require(`./components/20th/${file}`);
  client.components.set(component.name, component);
}

/* Event Listeners */
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, async (...args) => {
      try {
        await event.execute(...args);
      } catch (error) {
        const err = error;
        await handleErrorDebug(err, client);
      }
    });
  } else {
    client.on(event.name, async (...args) => {
      try {
        await event.execute(...args);
      } catch (error) {
        const err = error;
        await handleErrorDebug(err, client);
      }
    });
  }
}

// Logs into the server using the secret token
client.login(token20th);
