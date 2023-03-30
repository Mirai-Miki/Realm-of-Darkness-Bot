'use strict'

module.exports.isAdminOrST = require('./isAdminOrST');
module.exports.getCharacterClass = require('./getCharacterClass');
module.exports.tracker = require('./tracker');
module.exports.getHexColor = require('./getColorHex');
module.exports.verifySupporterStatus = require('./verifySupporterStatus');
module.exports.getValidImageURL = require('./getValidImageURL');
module.exports.setActivity = require('./setActivity');
module.exports.slugify = require('./misc').slugifiy;
module.exports.minToMilli = require('./misc').minToMilli;
module.exports.trimString = require('./misc').trimString;
module.exports.findCharacterCommand = require('./findCharacter').findCommand;
module.exports.findCharacterComponent = require('./findCharacter').findCharacter;
module.exports.deleteCharacterCommand = 
  require('./deleteCharacter').deleteCharacterCommand;
module.exports.deleteCharacterComponent = 
  require('./deleteCharacter').deleteCharacters;
module.exports.getCharacterList = require('./getCharacterList');
module.exports.setStorytellers = require('./setStorytellers');
module.exports.setTrackerChannel = require('./setTrackerChannel');
module.exports.canSendMessage = require('./canSendMessage');
module.exports.updateAllGuilds = require('./updateAllGuilds');