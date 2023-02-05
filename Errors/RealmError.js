'use strict'
const { EmbedBuilder } = require('discord.js');
const { oneLineTrim } = require('common-tags');
const { ErrorCodes } = require('./index');

module.exports = class RealmError extends Error
{
  constructor({cause, code=ErrorCodes.RealmError}={}) 
  {
    super(ErrorInfo[code].system);
    this.name = "RealmError";
    this.discordResponse = 
    {
      embeds: [getErrorEmbed(code)],
      ephemeral: true
    };
    this.debug = 
    {
      raise: ErrorInfo[code].debug,
      cause: ErrorInfo[code].cause
    };
    this.cause = cause;
    this.code = code;
  }
}

function getErrorEmbed(code)
{
  const embed = new EmbedBuilder()
    .setColor('#db0f20')
    .setThumbnail('https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png')

  embed.setTitle(ErrorInfo[code].embedTitle)
  let description = ErrorInfo[code].embedMessage;
  description += "\n[RoD Support Server](https://discord.gg/Qrty3qKv95)"
  embed.setDescription(description);
  return embed;
}

const ErrorInfo = 
{
  [ErrorCodes.RealmError]: 
  {
    system: "The Bot encountered an Error",
    embedTitle: 'Bot Error',
    embedMessage: oneLineTrim`
      Oops! Looks like you broke the bot. 
      If you see this please let us know in the support server so we can fix it!
    `,
    debug: true,
    cause: true
  },
  [ErrorCodes.DiscordAPIError]:
  {
    system: "Discord API threw an error",
    embedTitle: 'Discord API Error',
    embedMessage: oneLineTrim`
      Looks like discord is having some troubles, please try again later.
    `,
    debug: true,
    cause: true
  },
  [ErrorCodes.InvalidGeneralRollSets]:
  {
    system: "General Roll - User sent an invalid dice set",
    embedTitle: "Invalid Dice Set",
    embedMessage: 
      'The arguments need to be' +
      ' in the format "(x)d(y)" where (x) is' +
      ' the number of dice in the set and (y) is the' +
      ' number of sides on the dice.\nExample: "5d6"' +
      ' is 5 dice with six sides each.',
    debug: false,
    cause: false  
  },
  [ErrorCodes.InvalidGeneralRollDice]:
  {
    system: "General Roll - user sent an int out of range",
    embedTitle: 'Number out of range',
    embedMessage: 
      'The number of Dice cannot be more then 50.\n' +
      'The number of Dice Sides cannot be more than 500.',
    debug: false,
    cause: false
  },
  [ErrorCodes.GuildRequired]:
  {
    system: "This Command can only be done in a Server",
    embedTitle: 'Direct Message Error',
    embedMessage: oneLineTrim`
      This Command or an option of this Command needs to be run from a server.
    `,
    debug: false,
    cause: false
  },
  [ErrorCodes.NotAdminOrST]:
  {
    system: "Permission Error: Missing Admin or ST",
    embedTitle: 'Permission Error',
    embedMessage: oneLineTrim`
      This Command or an option of this Command requires you to have Admin 
      or Storyteller permissions. Please check the Command and option descriptions.
    `,
    debug: false,
    cause: false
  },
  [ErrorCodes.NoCharacter]:
  {
    system: "No Character Error",
    embedTitle: 'No Character Error',
    embedMessage: oneLineTrim`
      We could not find a character with this name. Please check the name 
      is correct or create a new character.
    `,
    debug: false,
    cause: false
  },
}