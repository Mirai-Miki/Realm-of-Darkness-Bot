'use strict'
const { ComponentCID } = require("../../Constants");
const { RealmError, ErrorCodes } = require("../../Errors");
const API = require('../../realmAPI');
const checkPerms = require('../../modules/Initiative/checkButtonPerm');

module.exports = {
  name: ComponentCID.INIT_NEXT_ROUND,
  async execute(interaction) 
  {
    await interaction.deferReply({ephemeral: true});
    const tracker = await API.getInitTracker(interaction.channelId);
    if (!tracker) throw new RealmError({
      code: ErrorCodes.InitNoTracker,
      cause: 'pressed next round button' 
    });
    await checkPerms(interaction, tracker);
    return await tracker.rollPhase(interaction);
  },
}