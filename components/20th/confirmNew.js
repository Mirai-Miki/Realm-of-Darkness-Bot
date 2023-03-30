'use strict'
const { ComponentCID } = require("../../Constants");
const InitiativeTracker = require("../../structures/InitiativeTracker");
const API = require('../../realmAPI');

module.exports = {
  name: ComponentCID.INIT_CONFIRM,
  async execute(interaction) 
  {
    await interaction.deferUpdate({ephemeral: true});
    let tracker = await API.getInitTracker(interaction.channelId);
    const message = await interaction.channel.messages.fetch(tracker.messageId);
    if (message) await message.delete();
    tracker = new InitiativeTracker({
      channelId: interaction.channel.id,
      guildId: interaction.guild.id,
      startMemberId: interaction.member.id
    });
    return await tracker.rollPhase(interaction);
  },
}