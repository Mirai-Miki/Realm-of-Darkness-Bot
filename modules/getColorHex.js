'use strict'
const { RealmError, ErrorCodes } = require('../Errors')

module.exports = function getColorHex(string)
{
  if (!string) return null;
  
  const match = string.match(/^\s*#(\d|[a-f]){6}\s*$/i)
  if (match) return match[0].trim()
  throw new RealmError({code: ErrorCodes.NotHexNumber})
}