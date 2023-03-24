'use strict'
const { ComponentCID } = require("../../Constants");
const { InitiativeTracker } = require("../../structures");

module.exports = {
  name: ComponentCID.INIT_CONFIRM,
  async execute(interaction) 
  {
    await interaction.deferReply({ephemeral: true});
    tracker = new InitiativeTracker({
      channelId: channel.id,
      guildId: interaction.guild.id,
      startMemberId: interaction.member.id
    });
    return await tracker.rollPhase(interaction);
  },
}