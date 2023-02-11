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
      ephemeral: true,
      content: '',
      components: []
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
  [ErrorCodes.NotAdmin]:
  {
    system: "Permission Error: Missing Admin",
    embedTitle: 'Permission Error',
    embedMessage: oneLineTrim`
      This Command or an option of this Command requires you to have Admin 
      permissions. Please check the Command and option descriptions.
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
  [ErrorCodes.NotHexNumber]:
  {
    system: "Input was not a Hex number",
    embedTitle: 'Input was not a Hex number',
    embedMessage: oneLineTrim`
      The color option requires a hex number. 
      A hex number looks like this #5c7c18 you can get one from any color picker 
      like the one found [here](https://g.co/kgs/yM4p6k).
    `,
    debug: false,
    cause: false
  }, 
  [ErrorCodes.NotImageURL]:
  {
    system: "Input was not an Image URL",
    embedTitle: 'Input was not an Image URL',
    embedMessage: oneLineTrim`
      The image option requires a valid Image URL. 
      The easiest way to get this, is to updload an image on discord. 
      Right click that Image and select "Copy Link".
    `,
    debug: false,
    cause: false
  },  
  [ErrorCodes.RequiresFledgling]:
  {
    system: "Permission Error: Requires Fledgling",
    embedTitle: 'Permission Error: Fledgling Supporter Required.',
    embedMessage: oneLineTrim`
      This Command or an option in this command requires being a supporter 
      of at least Fledgling or higher. 
      You can become a supporter over on my 
      [Patreon](https://www.patreon.com/MiraiMiki)
    `,
    debug: false,
    cause: false
  },  
  [ErrorCodes.NightmareOutOfRange]:
  {
    system: "Nightmare out of range",
    embedTitle: 'Nightmare out of Range Error',
    embedMessage: oneLineTrim`
      The nightmare dice cannot be higher then your pool.
    `,
    debug: false,
    cause: false
  },  
  [ErrorCodes.NoNamesList]:
  {
    system: "No Names List",
    embedTitle: 'No Characters',
    embedMessage: oneLineTrim`
      We could not find any characters for this user. 
      If you are using this from a server we are only looking for characters 
      on this server. If you want to find all characters use this command 
      in a DM with the Bot.
    `,
    debug: false,
    cause: false
  },   
  [ErrorCodes.NotTextChannel]:
  {
    system: "Not a text channel",
    embedTitle: 'Invalid Channel',
    embedMessage: oneLineTrim`
      The selected channel must be a test channel and cannot be a thread.
    `,
    debug: false,
    cause: false
  },   
  [ErrorCodes.InvalidChannelPermissions]:
  {
    system: "Not a text channel",
    embedTitle: 'Invalid Channel Permissions',
    embedMessage: 
      'The selected channel requires the following permissions to function.' +
      '\n- View Channel\n- Send Messages\n- Embed Links'
    ,
    debug: false,
    cause: false
  },
}