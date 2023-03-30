'use strict'
const { ComponentCID } = require("../../Constants");
const deleteCharacterComponent = require('../../modules/deleteCharacter').component;

module.exports =
{
  name: ComponentCID.DeleteCharacters,
  async execute(interaction)
  {
    await interaction.deferUpdate({ephemeral: true});
    return await deleteCharacterComponent(interaction);
  }
}