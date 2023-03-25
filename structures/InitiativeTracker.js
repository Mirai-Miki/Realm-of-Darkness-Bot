'use strict'
const API = require('../realmAPI');
const { Collection, EmbedBuilder } = require("discord.js");
const { RealmError, ErrorCodes } = require('../Errors');
const InitiativeCharacter = require('./InitiativeCharacter');
const { getInitiativeButtonRow } = require('../modules/Initiative/getButtonRow');
const { InitPhase } = require('../Constants');

module.exports = class InitiativeTracker
{
  constructor({
    channelId=null,
    guildId=null,
    startMemberId=null,
    json=null}={}
  )
  {
    this.phase = InitPhase.ROLL;
    this.channelId = channelId;
    this.guildId = guildId;
    this.messageId = null;
    this.startMemberId = startMemberId;
    
    this.characters = new Collection();
    this.actions = [];
    this.round = 0;
    this.tag = null;

    if (json) this.deserialize(json);
  }

  //////////////////////////// Command Interactions ///////////////////////////
  async characterRoll(interaction, reroll=false)
  {
    if (this.phase > InitPhase.ROLL2 && this.phase !== InitPhase.JOIN)
    {
      throw new RealmError({code: ErrorCodes.InitInvalidPhase});
    }

    const name = interaction.options.getString('name');
    let dexWits = interaction.options.getInteger('dex_wits');
    let modifier = interaction.options.getInteger('modifier') ?? 0;
    let extraActions = interaction.options.getInteger('extra_actions') ?? 0;

    let character = 
      this.characters.get(`${interaction.user.id}|${name.toLowerCase()}`);
    
    if (reroll && !character) 
      throw new RealmError({code: ErrorCodes.InitNoCharacter});
    else if (reroll)
    {
      dexWits = character.dexWits;
      modifier = character.modifier;
      extraActions = interaction.options.getInteger('extra_actions') ?? 
        character.extraActions;
    }
    else if (!character)
      character = new InitiativeCharacter({
        name: name, 
        memberId: interaction.member.id
      });
    
    character.rollInitiative(dexWits, modifier, extraActions);
    this.characters.set(`${interaction.user.id}|${name.toLowerCase()}`, character);    

    let mod = ''
    if (character.modifier) mod = ` and a modifier of <${character.modifier}>`;
    let actionMess = ''
    if (character.extraActions) actionMess = 
      `You will also get ${character.extraActions} extra actions.\n`;

    if (this.characters.size >= 2) this.phase = InitPhase.ROLL2;
    await this.post(interaction.client);
    
    return {
      content: 
        `You have rolled with a Dex+Wits of <${character.dexWits}>${mod}\n` +
        actionMess +
        "If this is not correct please reroll before everyone is ready!"
    }
  }

  async characterDeclare(interaction)
  {
    if (this.phase !== InitPhase.DECLARE)
      throw new RealmError({code: ErrorCodes.InitInvalidPhase});

    let currentChar;
    let nextChar = null;
    for (const order of this.actions)
    {
      const character = this.characters.get(order.id);
      if (!currentChar && !order.action)
      {
        if (character.memberId != interaction.member.id)
          throw new RealmError({code: ErrorCodes.InitInvalidTurn});
        currentChar = character;
        order.action = interaction.options.getString("action");
      }
      else if (currentChar)
      {
        nextChar = character;
        this.tag = `<@${nextChar.memberId}>`
        break;
      }
    }
    
    if (!nextChar) tracker.phase = InitPhase.DECLARED;
    this.post(interaction.client, tag);
    return {content: 'Your action has been declared!'};
  }

  async characterJoin(interaction)
  {
    if (this.phase !== InitPhase.JOIN)
      throw new RealmError({code: ErrorCodes.InitInvalidPhase});
  }

  async repost(interaction)
  {
    await this.post(interaction.client);
  }

  ////////////////////////// Button Interactions //////////////////////////////
  async rollPhase(interaction)
  {
    this.phase = InitPhase.ROLL;
    this.round++;
    for (const character of this.characters.values()) {character.newRound()}
    await this.post(interaction.client);
    return {content: 'Ready to go!', embeds: [], components: []};
  }

  async revealPhase(interaction)
  {
    this.phase = InitPhase.REVEAL;
    await this.post(interaction.client);
    return {content: 'Ready to go!', embeds: [], components: []};
  }

  async declarePhase(interaction)
  {
    this.phase = InitPhase.DECLARE;
    this.characters.sort(sortInitAscending);
    for (const character of this.characters.values())
    { // Normal action order in reverse
      if (!character.joinedRound) continue;
      this.actions.unshift({id: character.id+'|'+character.name, action: null});
    }
    for (const character of this.characters.values())
    { // extra actions
      if (!character.joinedRound) continue;
      let extraActions = character.extraActions;
      for (extraActions; extraActions > 0; extraActions--)
      {
        this.actions.unshift({id: character.id+'|'+character.name, action: null});
      }
    }
    await this.post(interaction.client);
    return {content: 'Ready to go!', embeds: [], components: []};
  }

  async declaredPhase(interaction)
  {
    this.phase = InitPhase.DECLARED    
    await this.post(interaction.client);
    return {content: 'Your action has been declared!', embeds: [], components: []};
  }

  async joinPhase(interaction)
  {
    this.phase = InitPhase.JOIN;
    this.round++;
    for (const character of this.characters.values())
    {
      character.joinedRound = false;
      character.extraActions = 0;
      character.declared = false;
      character.action = null;
    }
    await this.post(interaction.client);
    return {content: 'Ready to go!', embeds: [], components: []};
  }

  async endPhase(interaction)
  {

  }

  ///////////////////////////// Utility Methods //////////////////////////////
  async save()
  {
    await API.setInitTracker(this.channelId, this.guildId, this.serialize());
  }

  async post(client)
  {
    console.log(this)
    const channel = await client.channels.fetch(this.channelId);
    let oldMessage;
    if (this.messageId) oldMessage = await channel.messages.fetch(this.messageId); 

    const response = 
    {
      content: null,
      embeds: [await getTrackerEmbed(this, channel.guild.members)],
      components: [getInitiativeButtonRow(this.phase)]
    }
    if (this.phase === InitPhase.DECLARE) response.content = this.tag;
    const message = await channel.send(response);
    this.messageId = message.id;

    try {await this.save()}
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
      start_member_id: this.startMemberId,
      round: this.round,
      characters: characters,
      actions: this.actions,
      tag: this.tag
    }
  }

  deserialize(json)
  {
    // Takes in json tracker and contructs the tracker from it
    this.phase = json.phase;
    this.channelId = json.channel_id;
    this.guildId = json.guild_id;
    this.messageId = json.message_id;
    this.startMemberId = json.startMemberId;
    this.round = json.round;
    this.actions = json.actions;
    this.tag = json.tag;

    for (const character of json.characters)
    {
      this.characters.set(
        `${character.member_id}|${character.name.toLowerCase()}`, 
        new InitiativeCharacter({json: character})
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

//////////////////////////////////// Embed Shit ///////////////////////////////
async function getTrackerEmbed(tracker, members)
{
  const info = getTrackerEmbedInfo(tracker);
  const embed = new EmbedBuilder()
    .setTitle(info.title)
    .setDescription(info.description)
    .setColor(info.color)

  if (tracker.phase <= InitPhase.ROLL2)
  {    
    console.log(tracker.characters)
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
    for (const order of tracker.actions)
    {
      const character = tracker.characters.get(order.id);      
      const member = await members.fetch(character.memberId);
      if (!character.joinedRound) continue;
      // Go through and set each member and their action
      let value = "";
        
      if (order.action) value = order.action;
      else if (!order.action && !current)
      {
        value = "📍 Please decalare your action!";
        current = true;
      }
      else value = "Undeclared";

       fields.unshift({
         title: `${character.name} (${member.displayName})`,
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
    case InitPhase.NEW:
    case InitPhase.ROLL:
    case InitPhase.ROLL2:
      return {        
        title: `${round} Roll for Initiative!`,
        description: 
          "Please use the `/init roll` command " +
          "to roll for Initiative.\nWhen everone has rolled, press the " +
          "(Reveal Initiative) button" +
          "\n----------------------------------",
        color: "#c41d71"
      }
    case InitPhase.REVEAL:      
      return {
        title: `${round} Initiative Order!`,
        description: "----------------------------------",
        colour: "#c41d71"
      }
    case InitPhase.DECLARE:
      return {
        title: `${round} Declare Actions!`,
        description: 
          "Please use the `/init declare` command " +
          "to declare your actions.\nActions are declared in " +
          "descending order of Initiative. You can only declare " +
          "on your turn!\n----------------------------------",
        color: "#c41d71"
      }
    case InitPhase.DECLARED:
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
    case InitPhase.JOIN:
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