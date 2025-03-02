"use strict";
require(`${process.cwd()}/alias`);
const { ComponentCID } = require("@constants");
const findCharacterComponent = require("@modules/findCharacter").component;

module.exports = {
  name: ComponentCID.FindCharacter,
  async execute(interaction) {
    await interaction.deferUpdate({ ephemeral: true });
    return await findCharacterComponent(interaction);
  },
};
