"use strict";
require(`${process.cwd()}/alias`);
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { handleErrorDebug } = require("@errors");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");

// Load environment variables
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [Partials.GuildMember, Partials.User],
});

/* Loading Commands in Client */
client.commands = new Collection();
const commandsPath = path.join(process.cwd(), "src", "commands", "cod");
if (!fs.existsSync(commandsPath)) {
  console.error(`Commands directory not found: ${commandsPath}`);
  process.exit(1);
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
      client.commands.set(command.data.name, command);
      console.log(`Command loaded: ${command.data.name}`);
    }
  } catch (error) {
    console.error(`Failed to load command from ${file}:`, error);
  }
}

/* Event Listeners */
const eventsPath = path.join(process.cwd(), "src", "events");
console.log("Events Path:", eventsPath);

if (!fs.existsSync(eventsPath)) {
  console.error(`Events directory not found: ${eventsPath}`);
  process.exit(1);
}

const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of eventFiles) {
  try {
    const event = require(path.join(eventsPath, file));
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
    console.log(`Event loaded: ${event.name}`);
  } catch (error) {
    console.error(`Failed to load event from ${file}:`, error);
  }
}

// Logs into the server using the environment variable
client.login(process.env.TOKEN_COD);