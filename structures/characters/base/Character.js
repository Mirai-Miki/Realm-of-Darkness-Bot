'use strict';
const { GuildMember } = require("discord.js");
const Consumable = require("../../Consumable");
const API = require('../../../realmAPI');
const sendToTrackerChannel = require('../../../modules/sendToTrackerChannel');

module.exports = class Character 
{
  constructor({name, user, guild}={}) 
  {
    this.name = name;
    this.id = null;
    this.user = {
        id: '', 
        username: null, 
        discriminator: null, 
        avatarURL: null, 
        displayName: null
    };
    this.guild = {
        id: null, 
        name: null, 
        iconURL: null
    };
    this.exp = new Consumable(0);
    this.thumbnail = null;
    this.color = '#000000';
    this.history = {};
    this.changes = {};
    if (guild) this.setGuild(guild);
    if (user) this.setUser(user);
  }

  /**
   * Takes in a user of Guild member and sets the character user fields
   * @param {User|GuildMember} user 
   */
  setUser(userData)
  {
    let member;
    let user;
    if (userData instanceof GuildMember)
    {
      user = userData.user;
      member = userData;
    }
    else user = userData;

    // User can be either a User or GuildMember
    this.user.id = user.id;
    this.user.username = user.username;
    this.user.discriminator = user.discriminator;
    this.user.avatarURL = member?.displayAvatarURL() ?? user.displayAvatarURL();
    this.user.displayName = member?.displayName ?? user.username;
  }

  setGuild(guild)
  {
    if (!guild) return;
    this.guild.id = guild.id;
    this.guild.name = guild.name;
    this.guild.iconURL = guild.iconURL() ?? '';
  }

  setFields(args)
  {
    if (args.nameChange != null) this.name = args.nameChange;  
    if (args.exp != null) this.exp.setTotal(args.exp);
    if (args.color != null) this.color = args.color;
    if (args.thumbnail?.toLowerCase() === 'none') this.thumbnail = null;
    else if (args.thumbnail != null) this.thumbnail = args.thumbnail;
    this.changes = getChanges(args);
  }

  updateFields(args)
  {
    if (args.exp && args.exp < 0) this.exp.updateCurrent(args.exp);
    else if (args.exp != null) this.exp.incTotal(args.exp);    
    this.changes = getChanges(args);
  }

  deserilize(json)
  {
    this.id = json.id;
    this.name = json.name;
    this.color = json.theme; 
    this.thumbnail = json.thumbnail;
    this.exp.setTotal(json.exp.total);
    this.exp.setCurrent(json.exp.current); 
    //this.history = json.history; 
    
    if (json.user)
    {
      this.user.id = json.user.id;
      this.user.username = json.user.username;
      this.user.discriminator = json.user.discriminator;
      this.user.avatarURL = json.user.avatarURL;
      this.user.displayName = json.user.displayName;
    }

    if(json.guild)
    {
      this.guild.id = json.guild.id;
      this.guild.name = json.guild.name;
      this.guild.iconURL = json.guild.iconURL;
    }
    return this;
  }

  serialize()
  {
      const s = {character: {}};
      s.character['name'] = this.name;
      s.character['id'] = this.id;
      s.user_id = this.user.id ? this.user.id : null;        
      s.guild_id = this.guild.id ? this.guild.id : null;        
      s.character['theme'] = this.color;
      s.character['thumbnail'] = this.thumbnail ?? undefined;
      s.character['exp'] = {
          total: this.exp.total,
          current: this.exp.current,    
      };
      s.character['log'] = this.changes;
      return s;
  }

  async save(client)
  {
    if (Object.keys(this.changes).length > 1)
    {
      if (this.changes.command === 'New Character')
        await API.newCharacter(this.serialize());
      else
        await API.saveCharacter(this.serialize());
      await sendToTrackerChannel(client, this)
    }
  }
}

function getChanges(args)
{
  const changes = structuredClone(args);
  delete changes.name;
  for (const [key, value] of Object.entries(changes))
  {
    if (value === null) 
    {
      delete changes[key];
      continue;
    }
    if (key === 'player')
    {
      changes.storytellerModified = 'True'
      delete changes.player;
    }
    if (key === 'thumbnail') changes.thumbnail = 'Set';
  }
  return changes;
}