'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const frenzy = require('../../modules/dice/5th/frenzy');
const commandUpdate = require('../../modules/commandDatabaseUpdate');

module.exports = {
  data: getCommand(),
  async execute(interaction) {
    await interaction.deferReply();
    await commandUpdate(interaction);
    if (!interaction.isRepliable()) return 'notRepliable';

    return await frenzy(interaction);
  }
};

function getCommand() {
  const command = new SlashCommandBuilder()
    .setName('frenzy')
    .setDescription('Rolls to resist frenzy with your character.')

    .addIntegerOption(option => {
      option.setName("difficulty")
        .setDescription("The Difficulty of the frenzy test. " +
          "p220 v5 Corebook")
        .setMaxValue(50)
        .setMinValue(1)
        .setRequired(true)
      return option;
    })

    .addIntegerOption(option => {
      option.setName("modifier")
        .setDescription("Adds or removed additional dice.")
        .setMaxValue(50)
        .setMinValue(1)
      return option;
    })

    .addStringOption(option => {
      option.setName("name")
        .setDescription("Name of the character making the roll. " +
          'Must be a sheet character.')
        .setMaxLength(50)
      return option;
    })


    .addStringOption(option => {
      option.setName("notes")
        .setDescription("Any extra information you would like to include about this roll.")
        .setMaxLength(300)
      return option;
    })

  return command;
}
