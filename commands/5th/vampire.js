"use strict";
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Splats } = require("../../Constants");
const tracker = require("../../modules/tracker");
const getHexColor = require("../../modules/getColorHex");
const verifySupporterStatus = require("../../modules/verifySupporterStatus");
const commandUpdate = require("../../modules/commandDatabaseUpdate");
const autocomplete5th = require("../../modules/autocomplete");

module.exports = {
  data: getCommands(),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await commandUpdate(interaction);

    if (!interaction.isRepliable()) return "notRepliable";
    interaction.arguments = await getArgs(interaction);
    switch (interaction.options.getSubcommand()) {
      case "new":
        const res = await tracker.new(interaction, Splats.vampire5th);
        await sheetFollowUp(interaction);
        return res;
      case "update":
        const update = await tracker.update(interaction, Splats.vampire5th);
        await oldVampireFollowUp(interaction);
        return update;
      case "set":
        return await tracker.set(interaction, Splats.vampire5th);
    }
  },

  async autocomplete(interaction) {
    return await autocomplete5th(interaction, Splats.vampire5th.slug);
  },
};

async function sheetFollowUp(interaction) {
  if (!interaction.followUps) interaction.followUps = [];
  const message = { ephemeral: true, embeds: [] };

  const embed = new EmbedBuilder();
  embed
    .setColor("#ede61a")
    .setTitle("Sheets now in Early Access")
    .setDescription(
      'Character sheets are now in Early Access on the [Website](https://realmofdarkness.app).\nCharacter sheets are fully compatible with the bot tracker commands as well as providing an easy to use web interface to update values. It also gives you access to the `/sheet roll` command which is an easier way to build pools without having to look at your sheet to make rolls.\n\nTo create a new sheet all you need to do is Login to the [Website](https://realmofdarkness.app) and click the "New Sheet button" to get started.\n\nPlease note that early access sheets are still missing many features and will be slowly added too over time to become more feature complete.'
    );
  message.embeds.push(embed);
  interaction.followUps.push(message);
}

async function oldVampireFollowUp(interaction) {
  if (interaction.character.class) return;
  if (!interaction.followUps) interaction.followUps = [];
  const message = { ephemeral: true, embeds: [] };

  const embed = new EmbedBuilder();
  embed
    .setColor("#ede61a")
    .setTitle("Old Tracker")
    .setDescription(
      "This Vampire tracker is currently not compatible with the new tracker/sheet system, while it will continue to work for now, support will eventually be dropped some time in the future.\n\nTo avoid losing any data, please make a new tracker using the `/vampire new` command. Alternatively you can try the new Character Sheets which are currently in Early Access on the [Website](https://realmofdarkness.app)."
    );
  message.embeds.push(embed);
  interaction.followUps.push(message);
}

async function getArgs(interaction) {
  const args = {
    player: interaction.options.getUser("player"),
    name: interaction.options.getString("name"),
    exp: interaction.options.getInteger("exp"),
    notes: interaction.options.getString("notes"),
    nameChange: interaction.options.getString("change_name"),
    thumbnail: interaction.options.getAttachment("image"),
    color: getHexColor(interaction.options.getString("color")),
    willpower: interaction.options.getInteger("willpower"),
    health: interaction.options.getInteger("health"),
    willpowerSup: interaction.options.getInteger("willpower_superficial"),
    willpowerAgg: interaction.options.getInteger("willpower_agg"),
    healthSup: interaction.options.getInteger("health_superficial"),
    healthAgg: interaction.options.getInteger("health_agg"),
    hunger: interaction.options.getInteger("hunger"),
    humanity: interaction.options.getInteger("humanity"),
    stains: interaction.options.getInteger("stains"),
  };

  if (args.color || args.thumbnail)
    await verifySupporterStatus.fledgling(interaction.user.id);
  return args;
}

function getCommands() {
  const command = new SlashCommandBuilder()
    .setName("vampire")
    .setDescription("vampire tracker commands");

  ////////////////// New Vampire ////////////////////////////
  command.addSubcommand((subcommand) =>
    subcommand
      .setName("new")
      .setDescription("Create a new v5 Vampire.")

      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of your Character")
          .setRequired(true)
          .setMaxLength(50)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower")
          .setDescription(
            "Your total Willpower. " +
              "Must be between 1 and 20. VtM v5 Corebook p157"
          )
          .setMaxValue(20)
          .setMinValue(1)
          .setRequired(true)
      )

      .addIntegerOption((option) =>
        option
          .setName("health")
          .setDescription(
            "Your total Health. " +
              "Must be between 1 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(1)
          .setRequired(true)
      )

      .addIntegerOption((option) =>
        option
          .setName("humanity")
          .setDescription(
            "Your current Humanity. " +
              "Must be between 0 and 10. VtM v5 Corebook p236"
          )
          .setMaxValue(10)
          .setMinValue(0)
          .setRequired(true)
      )

      .addIntegerOption((option) =>
        option
          .setName("hunger")
          .setDescription(
            "Your current Hunger. " +
              "Must be between 0 and 5. VtM v5 Corebook p205"
          )
          .setMaxValue(5)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("exp")
          .setDescription("Your total Experiance. VtM v5 Corebook p130")
          .setMaxValue(1000)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_superficial")
          .setDescription(
            "Your current Superficial Willpower Damage. " +
              "Must be between 0 and 15. VtM v5 Corebook p126"
          )
          .setMaxValue(15)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_agg")
          .setDescription(
            "Your current Aggravated Willpower Damage. " +
              "VtM v5 Corebook p126"
          )
          .setMaxValue(15)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_superficial")
          .setDescription(
            "Your current Superficial Health Damage. " +
              "Must be between 0 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_agg")
          .setDescription(
            "Your current Aggravated Health Damage. " +
              "Must be between 0 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("stains")
          .setDescription(
            "Your current Stains. " +
              "Must be between 0 and 10. VtM v5 Corebook p239"
          )
          .setMaxValue(10)
          .setMinValue(0)
      )

      .addStringOption((option) =>
        option
          .setName("notes")
          .setDescription(
            "Any additional information you would like to include."
          )
          .setMaxLength(300)
      )

      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription(
            "Changes the side bar color." +
              " Enter a color hex code eg #6f82ab. [Supporter Only]"
          )
          .setMaxLength(7)
          .setMinLength(7)
      )

      .addAttachmentOption((option) =>
        option
          .setName("image")
          .setDescription(
            "Changes your Character's Thumbnail" + " Image. [Supporter Only]"
          )
      )
  );

  //////////////////// Set Command ////////////////////////////////
  command.addSubcommand((subcommand) =>
    subcommand
      .setName("set")
      .setDescription("Set values for your v5 Vampire.")

      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of your Character")
          .setRequired(true)
          .setMaxLength(50)
          .setAutocomplete(true)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower")
          .setDescription(
            "Your total Willpower. " +
              "Must be between 1 and 20. VtM v5 Corebook p157"
          )
          .setMaxValue(20)
          .setMinValue(1)
      )

      .addIntegerOption((option) =>
        option
          .setName("health")
          .setDescription(
            "Your total Health. " +
              "Must be between 1 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(1)
      )

      .addIntegerOption((option) =>
        option
          .setName("humanity")
          .setDescription(
            "Your current Humanity. " +
              "Must be between 0 and 10. VtM v5 Corebook p236"
          )
          .setMaxValue(10)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("hunger")
          .setDescription(
            "Your current Hunger. " +
              "Must be between 0 and 5. VtM v5 Corebook p205"
          )
          .setMaxValue(5)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("exp")
          .setDescription(
            "Your total Experiance. " +
              "+ values will also increase your current. VtM v5 Corebook p130"
          )
          .setMaxValue(1000)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_superficial")
          .setDescription(
            "Your current Superficial Willpower Damage. " +
              "Must be between 0 and 15. VtM v5 Corebook p126"
          )
          .setMaxValue(15)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_agg")
          .setDescription(
            "Your current Aggravated Willpower Damage. " +
              "VtM v5 Corebook p126"
          )
          .setMaxValue(15)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_superficial")
          .setDescription(
            "Your current Superficial Health Damage. " +
              "Must be between 0 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_agg")
          .setDescription(
            "Your current Aggravated Health Damage. " +
              "Must be between 0 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(0)
      )

      .addIntegerOption((option) =>
        option
          .setName("stains")
          .setDescription(
            "Your current Stains. " +
              "Must be between 0 and 10. VtM v5 Corebook p239"
          )
          .setMaxValue(10)
          .setMinValue(0)
      )

      .addStringOption((option) =>
        option
          .setName("notes")
          .setDescription(
            "Any aditional information you would like to include."
          )
          .setMaxLength(300)
      )

      .addStringOption((option) =>
        option
          .setName("change_name")
          .setDescription("Change your Character's name.")
          .setMaxLength(50)
      )

      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription(
            "Changes the side bar color." +
              " Enter a color hex code eg #6f82ab. [Supporter Only]"
          )
          .setMaxLength(7)
          .setMinLength(7)
      )

      .addAttachmentOption((option) =>
        option
          .setName("image")
          .setDescription(
            "Changes your Character's Thumbnail" + " Image. [Supporter Only]"
          )
      )
  );

  //////////////////////// Update Command ////////////////////////////////////
  command.addSubcommand((subcommand) =>
    subcommand
      .setName("update")
      .setDescription("Update values for your v5 Vampire.")

      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of your Character")
          .setRequired(true)
          .setMaxLength(50)
          .setAutocomplete(true)
      )

      .addIntegerOption((option) =>
        option
          .setName("hunger")
          .setDescription(
            "Updates your Hunger by the amount. " +
              "Must be between -10 and 10. VtM v5 Corebook p205"
          )
          .setMaxValue(10)
          .setMinValue(-10)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_superficial")
          .setDescription(
            "Updates you current SW damage" +
              " by the amount. Must be between -20 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(-20)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_superficial")
          .setDescription(
            "Updates you current SH Damage" +
              " by the amount. Must be between -30 and 30. VtM v5 Corebook p126"
          )
          .setMaxValue(30)
          .setMinValue(-30)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower_agg")
          .setDescription(
            "Updates you current AW Damage" +
              " by the amount. Must be between -20 and 20. VtM v5 Corebook p126"
          )
          .setMaxValue(20)
          .setMinValue(-20)
      )

      .addIntegerOption((option) =>
        option
          .setName("health_agg")
          .setDescription(
            "Updates you current AH Damage" +
              " by the amount. Must be between -30 and 30. VtM v5 Corebook p126"
          )
          .setMaxValue(30)
          .setMinValue(-30)
      )

      .addIntegerOption((option) =>
        option
          .setName("stains")
          .setDescription(
            "Updates your Stains by the amount. " +
              "Must be between -15 and 15. VtM v5 Corebook p239"
          )
          .setMaxValue(15)
          .setMinValue(-15)
      )

      .addIntegerOption((option) =>
        option
          .setName("exp")
          .setDescription(
            "Updates you Current Exp by the amount." +
              "+ values will also increase your total. VtM v5 Corebook p130"
          )
          .setMaxValue(2000)
          .setMinValue(-2000)
      )

      .addIntegerOption((option) =>
        option
          .setName("willpower")
          .setDescription(
            "Updates your Total Willpower by the amount. " +
              "Must be between -20 and 20. VtM v5 Corebook p157"
          )
          .setMaxValue(20)
          .setMinValue(-20)
      )

      .addIntegerOption((option) =>
        option
          .setName("health")
          .setDescription(
            "Updates your Total Health by the amount. " +
              "Must be between -30 and 30. VtM v5 Corebook p126"
          )
          .setMaxValue(30)
          .setMinValue(-30)
      )

      .addIntegerOption((option) =>
        option
          .setName("humanity")
          .setDescription(
            "Updates your Humanity by the amount. " +
              "Must be between -15 and 15. VtM v5 Corebook p236"
          )
          .setMaxValue(15)
          .setMinValue(-15)
      )

      .addUserOption((option) =>
        option
          .setName("player")
          .setDescription(
            "The player the character belongs to. Used by STs" +
              " to update another players Char [ST Only]"
          )
      )

      .addStringOption((option) =>
        option
          .setName("notes")
          .setDescription(
            "Any aditional information you would like to include."
          )
          .setMaxLength(300)
      )
  );
  return command;
}
