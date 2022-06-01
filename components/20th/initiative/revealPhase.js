'use strict'
const { ComponentCID, InitPhase } = require("../../../Constants/Constants20th");
const { Initiative } = require("../../../modules/Initiative/Initiative");

module.exports = {
    name: ComponentCID.INIT_REVEAL,
    async execute(interaction) 
    {
        await interaction.deferReply({ephemeral: true});
        await Initiative.setPhase(interaction, InitPhase.REVEAL);
    },
}