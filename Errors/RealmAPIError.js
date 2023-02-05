'use strict'
const { EmbedBuilder } = require('discord.js');
const { oneLineTrim } = require('common-tags');
const { APIErrorCodes } = require('./index');

module.exports = class RealmAPIError extends Error
{
  constructor({cause, code=APIErrorCodes.RealmAPIError}={}) 
  {
    super(ErrorInfo[code].system);
    this.name = "RealmAPIError";
    this.discordResponse = 
    {
      embeds: [getErrorEmbed(ErrorInfo[code])],
      ephemeral: true
    }
    this.debug = 
    {
      raise: ErrorInfo[code].debug,
      cause: ErrorInfo[code].cause
    }
    this.cause = cause;
    this.code = code;
  }
}

function getErrorEmbed(info)
{
  const embed = new EmbedBuilder()
    .setColor('#db0f20')
    .setThumbnail('https://cdn.discordapp.com/attachments/817275006311989268/974198094696689744/error.png')

  embed.setTitle(info.embedTitle)
  let description = info.embedMessage;
  description += "\n[RoD Support Server](https://discord.gg/Qrty3qKv95)"
  embed.setDescription(description);
  return embed;
}

const ErrorInfo = 
{
  [APIErrorCodes.RealmAPIError]: 
  {
    system: "Encounted an Error in the Realm API",
    embedTitle: 'Realm API Error',
    embedMessage: oneLineTrim`
      Sorry! We encountered an error accessing the Realm API. 
      If you see this please let us know in the support server so we can fix it!
    `,
    debug: true,
    cause: true
  },
  [APIErrorCodes.ConnectionRefused]: 
  {
    system: 'API refused to connect - ECONNREFUSED',
    embedTitle: 'Realm API Error',
    embedMessage: oneLineTrim`
      Sorry! We are having trouble connecting to the Realm API. 
      Please try again later. If the problem persists please reach out in the 
      support server. 
    `,
    debug: true,
    cause: false
  },
  [APIErrorCodes.CharacterExists]:
  {
    system: 'Realm API - Character already exists',
    embedTitle: 'Character already exists',
    embedMessage: oneLineTrim`
      Sorry, you already have a character with this name.
      Please choose another name and try again.
    `,
    debug: false,
    cause: false
  }
}