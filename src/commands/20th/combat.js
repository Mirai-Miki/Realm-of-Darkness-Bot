"use strict";
require(`${process.cwd()}/alias`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const { update } = require("@modules/tracker");
const { Splats } = require("@constants");
const commandUpdate = require("@modules/commandDatabaseUpdate");
const autocomplete20th = require("@modules/autocomplete");
const roll20th = require("@modules/dice/roll20th");

module.exports = {
  data: getCommands(),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await commandUpdate(interaction);
    if (!interaction.isRepliable()) return "notRepliable";
    return await roll20th(interaction);
  },

  async autocomplete(interaction) {
    return await autocomplete20th(interaction, Splats.vampire20th.slug);
  },
};

function getCommands() {
  return new SlashCommandBuilder()
    .setName("combat")
    .setDescription("V20 Combat System")
    .addSubcommand(sub => sub
      .setName("attack")
      .setDescription("Execute combat action")
      .addStringOption(opt => opt
        .setName("name")
        .setDescription("Attacker's name")
        .setRequired(true)
        .setAutocomplete(true))
      .addIntegerOption(opt => opt
        .setName("attack_pool")
        .setDescription("Attack pool (Dexterity + Ability)")
        .setMinValue(1)
        .setMaxValue(20)
        .setRequired(true))
      .addIntegerOption(opt => opt
        .setName("defense_pool")
        .setDescription("Defense pool (Dodge/Combat)")
        .setMinValue(1)
        .setMaxValue(20)
        .setRequired(true))
      .addIntegerOption(opt => opt
        .setName("damage_pool")
        .setDescription("Base damage (Strength + Weapon)")
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(true))
      .addStringOption(opt => opt
        .setName("damage_type")
        .setDescription("Type of damage inflicted")
        .setRequired(true)
        .addChoices(
          { name: "Bashing", value: "bashing" },
          { name: "Lethal", value: "lethal" },
          { name: "Aggravated", value: "aggravated" }
        ))
      .addIntegerOption(opt => opt
        .setName("absorption_pool")
        .setDescription("Defender's absorption pool")
        .setMinValue(0)
        .setMaxValue(10)
        .setRequired(true))
    );
}