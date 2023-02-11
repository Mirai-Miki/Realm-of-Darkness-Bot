'use strict'
const { ComponentCID } = require("../../Constants/Constants20th");
const { Initiative } = require("../../modules/Initiative/Initiative");

module.exports = {
    name: ComponentCID.INIT_END,
    async execute(interaction) 
    {
        await interaction.deferReply({ephemeral: true});
        await Initiative.endInitiative(interaction);
    },
}