'use strict'
const API = require('../realmAPI');
const { Collection, EmbedBuilder } = require("discord.js");
const { RealmAPIError, RealmError } = require('../Errors');
const initiativeCharacter = require('./InitiativeCharacter');
const { InitiativeTracker } = require('.');
const [ getInitiativeButtonRow ] = require('../modules/Initiative/getButtonRow');

module.exports = class InitiativeTracker
{
  static Phase = 
  {
    NEW: 0,
    ROLL: 1,
    REVEAL: 2,
    DECLARE: 3,
    DECLARED: 4,
    JOIN: 5,
    END: 6
  }

  constructor({
    phase=InitiativeTracker.Phase.ROLL,
    channelId=null,
    guildId=null,
    messageId=null,
    json=null}={}
  )
  {
    this.phase = phase;
    this.channelId = channelId;
    this.guildId = guildId;
    this.messageId = messageId;
    
    this.characters = new Collection();
    this.round = 0;

    if (json) this.deserialize(json);
  }

  //////////////////////////// Command Interactions ///////////////////////////
  async characterRoll(interaction, reroll=false)
  {
    if (
      this.phase !== InitiativeTracker.Phase.ROLL || 
      this.phase !== InitiativeTracker.Phase.JOIN)
    {
      throw new RealmAPIError();
    }

    const name = interaction.options.getString('name');
    let dexWits = interaction.options.getInteger('dex_wits');
    let modifier = interaction.options.getInteger('modifier') ?? 0;
    let extraActions = interaction.options.getInteger('extra_actions') ?? 0;

    let character = 
      this.characters.get(`${interaction.user.id}|${name.toLowerCase()}`);
    
    if (reroll && !character) throw new RealmError() // no character
    else if (reroll)
    {
      dexWits = character.dexWits;
      modifier = character.modifier;
      extraActions = character.extraActions;
    }
    else if (!character)
      character = new initiativeCharacter({name: name, member: interaction.member});
    
    character.rollInitiative(dexWits, modifier, extraActions);
    this.character.set(`${interaction.user.id}|${name.toLowerCase()}`);

    await this.post(interaction.clinet);

    let mod = ''
    if (character.modifier) mod = ` and a modifier of <${character.mod}>`;
    let actionMess = ''
    if (character.extraActions) actionMess = 
      `You will also get ${character.extraActions} extra actions.\n`;
    
    return {
      content: 
        `You have rolled with a Dex+Wits of <${character.pool}>${mod}\n` +
        actionMess +
        "If this is not correct please reroll before everyone is ready!"
    }
  }

  async characterDeclare()
  {
    if (this.phase !== InitiativeTracker.Phase.DECLARE)
      throw new RealmAPIError();
  }

  async characterJoin()
  {
    if (this.phase !== InitiativeTracker.Phase.JOIN)
      throw new RealmAPIError();
  }

  async repost()
  {

  }

  ////////////////////////// Button Interactions //////////////////////////////
  async rollPhase(interaction)
  {
    this.phase = InitiativeTracker.Phase.ROLL;
    this.round++;
    for (const character of this.characters.values())
    {
      character.joinedRound = false;
      character.extraActions = 0;
      character.declared = false;
      character.action = null;
    }

    await this.post(interaction.client);
    return {content: 'Ready to go!'};
  }

  async revealPhase(interaction)
  {
    this.phase = InitiativeTracker.Phase.REVEAL;
    await this.post(interaction.client);
    return {content: 'Ready to go!'}
  }

  async declarePhase(interaction)
  {
    this.phase = InitiativeTracker.Phase.DECLARE;
    await this.post(interaction.client);
    return {content: 'Ready to go!'}
  }

  async declaredPhase(interaction)
  {
    this.phase = InitiativeTracker.Phase.DECLARED    
    await this.post(interaction.client);
    return {content: 'Your action has been declared!'}
  }

  async joinPhase(interaction)
  {
    this.phase = InitiativeTracker.Phase.JOIN;
    this.round++;
    for (const character of this.characters.values())
    {
      character.joinedRound = false;
      character.extraActions = 0;
      character.declared = false;
      character.action = null;
    }
    await this.post(interaction.client);
    return {content: 'Ready to go!'}
  }

  ///////////////////////////// Utility Methods //////////////////////////////
  async save()
  {
    // Save tracker in its current state to the database
  }

  async post(client)
  {
    const channel = await client.channels.fetch(this.channelId);
    let oldMessage;
    if (this.messageId) oldMessage = await channel.messages.fetch(this.messageId); 

    const response = 
    {
      content: null,
      embeds: [getTrackerEmbed(this, channel.guild.members)],
      components: getInitiativeButtonRow(this.phase)
    }
    const message = await channel.send(response);
    this.messageId = message.id;

    try
    {
      await this.save();
    }
    catch (error)
    {
      message.delete();
      throw error;
    }
    if (oldMessage) oldMessage.delete();
  }

  serialize()
  {
    const characters = [];
    this.characters.forEach((character) => {
      characters.push(character.serialize())
    });

    return {
      phase: this.phase,
      channel_id: this.channelId,
      guild_id: this.guildId,
      message_id: this.messageId,
      round: this.round,
      characters: characters
    }
  }

  deserialize(json)
  {
    // Takes in json tracker and contructs the tracker from it
    this.phase = json.phase;
    this.channelId = json.channel_id;
    this.guildId = json.guild_id;
    this.messageId = json.message_id;
    this.round = json.round;

    for (const character of json.characters)
    {
      this.characters.set(
        `${character.member_id}|${character.name.toLowerCase()}`, 
        character
      );
    }
  }
}

////////////////////////////////// Private Functions //////////////////////////

function sortInitAscending(a, b)
{
    if (a.init > b.init) return -1;
    else if (a.init === b.init) // Handle Tie
    {
        if ((a.pool + a.mod) > (b.pool + b.mod)) return -1;
        else if ((a.pool + a.mod) === (b.pool + b.mod)) return 0;
        else return 1;
    }
    else return 1;
}

function sortInitDescending(a, b)
{
    if (a.init < b.init) return -1;
    else if (a.init === b.init) // Handle Tie
    {
        if ((a.pool + a.mod) < (b.pool + b.mod)) return -1;
        else if ((a.pool + a.mod) === (b.pool + b.mod)) return 0;
        else return 1;
    }
    else return 1;
}


//////////////////////////////////// Embed Shit ///////////////////////////////
async function getTrackerEmbed(tracker, members)
{
  const info = getTrackerEmbedInfo(tracker);
  const embed = new EmbedBuilder()
    .setTitle(info.title)
    .setDescription(info.description)
    .setColor(info.color)

  if (tracker.phase === InitPhase.ROLL)
  {
    for (const character of tracker.characters.values())
    {
      if (!character.joinedRound) continue;

      const member = await members.fetch(character.memberId);
      embed.addFields({
        name: `${character.name} (${member.displayName})`, 
        value: "Ready! ✅"
      });
    }
  }
  else if (tracker.phase === InitPhase.REVEAL)
  {
    let count = 1;            
    tracker.characters.sort(sortInitAscending); 
    // Sorts members in order of Initiative
    for (const character of tracker.characters.values())
    {
      if (!character.joinedRound) continue;
      const member = await members.fetch(character.memberId);

      let mod = "";
      if (character.mod) mod = `Modifier(${character.modifier})`;

      embed.addFields({
        name: `#${count} - ${character.name} `+
          `(${member.displayName})`, 
        value: `||Dex+Wits(${character.pool}) ${mod} 1d10(${character.d10})||` +
          `\nInitiative of: ${character.init}`
      });
      count++;
    }
  }
  else if (tracker.phase >= InitPhase.DECLARE)
  {
    const fields = [];
    let current = false;
    for (const character of tracker.characters.values())
    {
      if (!character.joinedRound) continue;
      // Go through and set each member and their action
      let value = "";
        
      if (character.declared) value = character.action;
      else if (!character.declared && !current)
      {
        value = "📍 Please decalare your action!";
        current = true;
      }
      else value = "Undeclared";

       fields.unshift({
         title: `${character.name} (${character.member.displayName})`,
         value: value
       });
     }

    for(const field of fields)
    {
      embed.addField({name: field.title, value: field.value});
    }
  }
  return embed;
}
function getTrackerEmbedInfo(tracker)
{
  let round = '';
  if (tracker.round > 1) round = `Turn: ${tracker.round} |`;

  switch (tracker.phase)
  {
    case InitiativeTracker.Phase.NEW:
    case InitiativeTracker.Phase.ROLL:
      return {        
        title: `${round} Roll for Initiative!`,
        description: 
          "Please use the `/init roll` command " +
          "to roll for Initiative.\nWhen everone has rolled, press the " +
          "(Reveal Initiative) button" +
          "\n----------------------------------",
        color: "#c41d71"
      }
    case InitiativeTracker.Phase.REVEAL:      
      return {
        title: `${round} Initiative Order!`,
        description: "----------------------------------",
        colour: "#c41d71"
      }
    case InitiativeTracker.Phase.DECLARE:
      return {
        title: `${round} Declare Actions!`,
        description: 
          "Please use the `/init declare` command " +
          "to declare your actions.\nActions are declared in " +
          "descending order of Initiative. You can only declare " +
          "on your turn!\n----------------------------------",
        color: "#c41d71"
      }
    case InitiativeTracker.Phase.DECLARED:
      return {
        title: `${round} Take your actions!!`,
        description: 
          "Actions are taken in order of " +
          "Initiative.\nWhen all actions have been taken " +
          "click the (Next Round) button to move into another " +
          "round or (End Initiative) if you are finished combat" +
          "\n----------------------------------",
        color: "#96150c"
      }
    case InitiativeTracker.Phase.JOIN:
      return {
        title: `${round} Join the next round!`,
        description: 
          "Initiative order will be the same as last round. " +
          "\nIf you were in the last round you can join this round with the " +
          "`/init join` command. If you are just joining the fight you can " +
          "use the `/init roll` command." +
          "\n----------------------------------",
        color: "#96150c"
      }
  }
}