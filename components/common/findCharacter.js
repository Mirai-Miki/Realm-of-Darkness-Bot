'use strict'
const { ComponentCID } = require("../../Constants");
const { findCharacterComponent } = require('../../modules');

module.exports =
{
  name: ComponentCID.FindCharacter,
  async execute(interaction)
  {
    await interaction.deferUpdate({ephemeral: true});
    return await findCharacterComponent(interaction);
  }
}