'use strict'
const { ComponentCID } = require("../../Constants")
const { RealmError, ErrorCodes } = require("../../Errors");
const API = require('../../realmAPI');
const checkPerms = require('../../modules/Initiative/checkButtonPerm');

module.exports = {
  name: ComponentCID.INIT_END,
  async execute(interaction) 
  {
    await interaction.deferReply({ephemeral: true});
    const tracker = await API.getInitTracker(interaction.channelId);
    if (!tracker) throw new RealmError({
      code: ErrorCodes.InitNoTracker,
      cause: 'pressed end tracker button' 
    });
    await checkPerms(interaction, tracker);
    
    let message;
    try
    {
      if (tracker.messageId) 
        message = await interaction.channel.messages.fetch(tracker.messageId); 
    }
    catch (error)
    {
      message = null;
    }
    await API.deleteInitTracker(interaction.channel.id);
    if (message) await message.delete();
    return {content: "Tracker Ended", embeds: [], components: []};
  },
}