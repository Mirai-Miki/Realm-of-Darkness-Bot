'use strict'
const { RealmError, ErrorCodes } = require('../../Errors');
const isAdminOrSt = require('../isAdminOrST'); 

module.exports = async function checkButtonPermissions(interaction, tracker)
{
  const admin = await isAdminOrSt(interaction.member, interaction.guild.id);
  if (tracker.startMemberId != interaction.memberId || !admin)
    throw new RealmError({code: ErrorCodes.InitInvalidButtonPerm});
}