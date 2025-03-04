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
    interaction.arguments = await getArgs(interaction);
    switch (interaction.options.getSubcommand()) {
      case "attack":
        return await applyBlood(interaction);
      //case "gain":
        //return await update(interaction, Splats.vampire20th);
      //case "check":
        //return await update(interaction, Splats.vampire20th);
    }
  },

  async autocomplete(interaction) {
    return await autocomplete20th(interaction, Splats.vampire20th.slug);
  },
};

async function applyBlood(interaction) {
 console.log(interaction);
 return await update(interaction, Splats.vampire20th);

}

async function getArgs(interaction) {
    const args = {
      name: interaction.options.getString("name"),
      
      defense_pool: interaction.options.getInteger("defense_pool"),
      attack_pool_enemy: interaction.options.getInteger("attack_pool_enemy"),
      damage_pool_weapon: interaction.options.getInteger("damage_pool_weapon"),
      
      notes: interaction.options.getString("notes") || "No notes provided"
    };
    
    return args;
  }

function getCommands() {
  const slashCommand = new SlashCommandBuilder()
    .setName("combat")
    .setDescription("kill the motherfucked");

  /////////////////////// attack combat ////////////////////////////

  slashCommand.addSubcommand((subcommand) =>
    subcommand
      .setName("attack")
      .setDescription("V20 combat system")

      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of your Character")
          .setRequired(true)
          .setMaxLength(50)
          .setAutocomplete(true)
      )

      .addIntegerOption(option =>
        option
           .setName("defense_pool")
           .setDescription("Your Defense pool (Dodge/Combat)")
          .setMinValue(1)
          .setMaxValue(50)
          .setRequired(true)
      )


      .addIntegerOption(option =>
        option
          .setName("attack_pool_enemy")
          .setDescription("Attack pool enemy (Skill + Strength)")
          .setMinValue(1)
          .setMaxValue(50)
          .setRequired(true)
      )

      .addStringOption((option) =>
        option
          .setName("damage_pool_weapon")
          .setDescription("Type Damage pool (Strength + Weapon)")
          .setRequired(true)
          .addChoices(
            { name: "Heal bashing", value: "bashing_damage" },
            { name: "Heal lethal", value: "lethal_damage" },
            { name: "Heal aggravated", value: "agg_damage" },
            { name: "disciplines", value: "use_discipline" }
          )
      )
  );
  return slashCommand;
}
