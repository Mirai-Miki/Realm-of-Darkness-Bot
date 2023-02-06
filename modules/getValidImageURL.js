'use strict'
const { RealmError, ErrorCodes } = require('../Errors')

module.exports = function getValidImageURL(string)
{
  if (!string) return null;
  
  const match = string.match(/^\s*https?:\/\/\S+(\.png|\.webp|\.jpg|\.jpeg|\.gif)\S*$/i)
  if (match) return match[0].trim()
  throw new RealmError({code: ErrorCodes.NotImageURL})
}