"use strict";
/**
 * Global Command Deployment Script
 *
 * This script registers slash commands with Discord for all bot versions.
 * It reads commands from their respective folders and deploys them globally.
 */
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

/**
 * Deploys commands for a specific bot version
 * @param {string} ver - Bot version identifier (5th, 20th, COD)
 * @returns {Promise<void>}
 */
async function pushCommands(ver) {
  const upperVer = ver.toUpperCase();
  const clientId = process.env[`CLIENT_ID_${upperVer}`];
  const token = process.env[`TOKEN_${upperVer}`];

  if (!clientId || !token) {
    console.error(`Missing environment variables for ${ver}`);
    return;
  }

  const lowerVer = ver.toLowerCase();
  const commandPath = path.join(process.cwd(), "commands", lowerVer);

  if (!fs.existsSync(commandPath)) {
    console.error(`Command directory not found: ${commandPath}`);
    return;
  }

  // Read command files
  const commands = [];
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

  if (commandFiles.length === 0) {
    console.warn(`No command files found for ${ver}`);
    return;
  }

  // Load each command
  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandPath, file));
      if (command.data) commands.push(command.data);
    } catch (error) {
      console.error(`Failed to load command from ${file}:`, error);
    }
  }

  // Setup REST API client
  const rest = new REST({ version: "10" }).setToken(token);

  // Deploy commands
  try {
    const response = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully registered ${response.length} ${ver} application commands`
    );
    return response.length;
  } catch (error) {
    console.error(`Failed to deploy ${ver} commands:`, error);
    return 0;
  }
}

// Execute deployment for all bot versions
(async () => {
  console.log("Starting command deployment...");
  const counts = await Promise.all([
    pushCommands("5th"),
    pushCommands("20th"),
    pushCommands("COD"),
  ]);

  const total = counts.reduce((acc, count) => acc + (count || 0), 0);
  console.log(
    `Command deployment completed. Total: ${total} commands registered`
  );
})();
