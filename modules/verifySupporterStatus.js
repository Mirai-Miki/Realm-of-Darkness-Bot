'use strict'
const API = require('../realmAPI');
const { Supporter } = require('../Constants');
const { RealmError, ErrorCodes } = require('../Errors');

module.exports.fledgling = async function(userId)
{
  const level = await API.getSupporterLevel(userId);
  if (level < Supporter.fledgling)
    throw new RealmError({code: ErrorCodes.RequiresFledgling})
}