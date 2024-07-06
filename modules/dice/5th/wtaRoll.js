"use strict";
const { trimString } = require("../../misc");
const getCharacter = require("../getCharacter");
const { getEmbed, getContent, getComponents } = require("./getWtaRollResponse");
const Wta5thRollResults = require("../../../structures/Wta5thRollResults");
const handleButtonPress = require("./handleButtonPress");
const API = require("../../../realmAPI");

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async function wtaRoll(interaction) {
  interaction.arguments = await getArgs(interaction);
  interaction.rollResults = await roll(interaction);

  await handleButtonPress(interaction, getEmbed, getComponents, getContent);
  return {
    content: getContent(interaction),
    embeds: [getEmbed(interaction)],
    components: getComponents(interaction),
  };
};

async function getArgs(interaction) {
  const args = {
    pool: interaction.options.getInteger("pool"),
    rage: interaction.options.getInteger("rage"),
    difficulty: interaction.options.getInteger("difficulty"),
    spec: interaction.options.getString("speciality"),
    rageCheck: interaction.options.getString("rage_check"),
    doubleRageCheck: interaction.options.getString("double_rage_check"),
    notes: interaction.options.getString("notes"),
    character: await getCharacter(
      trimString(interaction.options.getString("character")),
      interaction
    ),
    autoRage: interaction.options.getBoolean("auto_rage") ?? true,
  };

  if (interaction.guild && !args.character) {
    const defaults = await API.characterDefaults.get(
      interaction.guild.id,
      interaction.user.id
    );

    if (defaults && !args.character)
      args.character = await getCharacter(defaults.name, interaction);
  }

  return args;
}

/**
 * Takes a set of arguments and performs a roll
 * @param {Object} args Arguments recieved from the interaction
 */
async function roll(interaction) {
  const args = interaction.arguments;
  if (
    args.character?.tracked &&
    args.autoRage &&
    args.character.tracked.splat.slug === "werewolf5th"
  ) {
    args.rage = args.character.tracked.rage.current;
  }

  const results = new Wta5thRollResults({
    difficulty: args.difficulty ?? 1,
    pool: args.pool,
    spec: args.spec,
  });

  results.rollDice(args.rage);
  results.setOutcome();

  if (args.rageCheck != null) results.setRageCheck(args.rageCheck);
  else if (args.doubleRageCheck != null)
    results.setDoubleRageCheck(args.doubleRageCheck);

  await updateRage(interaction, results);
  return results;
}

async function updateRage(interaction, results) {
  let rage = 0;
  if (results.rageCheck?.passed === false) rage++;
  else if (results.doubleRageCheck?.decreased > 0)
    rage += results.doubleRageCheck.decreased;

  let character;
  if (interaction.arguments.character?.tracked)
    character = interaction.arguments.character.tracked;
  else if (interaction.arguments.sheet)
    character = interaction.arguments.character;

  if (character && rage && character.splat.slug === "werewolf5th") {
    const change = { command: "Dice Roll", rage: -rage };
    character.updateFields(change);
    await character.save(interaction.client);
    interaction.followUps = [
      {
        embeds: [character.getEmbed()],
        ephemeral: true,
      },
    ];
  }
}
