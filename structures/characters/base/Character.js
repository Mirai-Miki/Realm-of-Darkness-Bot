'use strict';
const Consumable = require("../../Consumable");

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
    //this.history = [];
    if (guild) this.setGuild(guild);
    if (user) this.setUser(user);
  }

  setUser(user)
  {
    // User can be either a User or GuildMember
    this.user.id = user.id;
    this.user.username = user?.user ? user.user.username : user.username;
    this.user.discriminator = user?.user ? user.user.discriminator : user.discriminator;
    this.user.avatarURL = user.displayAvatarURL() ?? '';
    this.user.displayName = user.displayName ?? null;
  }

  setGuild(guild)
  {
    if (!guild) return;
    this.guild.id = guild.id;
    this.guild.name = guild.name;
    this.guild.iconURL = guild.iconURL() ?? '';
  }

  updateHistory(charArgs, mode)
  {
    const history = {args: {}, notes: '', mode: ''};
      
    for (const key of Object.keys(charArgs))
    {
      const value = charArgs[key];
      
      if (key === 'name') continue;
      else if ((key === 'thumbnail' || key === 'colour') && value != null) 
      {
        history.args[key] = 'set';
      }
      else if (key === 'player' && value != null)
      {
        history.args["Updated by"] = "Storyteller";
      }
      else if (key === 'notes') continue;
      else if (value != null) history.args[key] = value;
    }
    
    history.notes = charArgs['notes'] ?? undefined;
    history.mode = mode;
    this.history.unshift(history);
  }

  deserilize(json)
  {
    this.id = json.id;
    this.name = json.name;
    this.colour = json.colour; 
    this.thumbnail = json.thumbnail;
    this.exp.setTotal(json.exp.total);
    this.exp.setCurrent(json.exp.current); 
    //this.history = json.history;   
    return this;
  }

  serialize()
  {
      const s = {character: {}, user: {}, guild: {}};
      s.character['name'] = this.name;
      s.character['id'] = this.id;
      s.user = this.user.id ? this.user : null;        
      s.guild = this.guild.id ? this.guild : null;        
      s.character['theme'] = this.color;
      s.character['thumbnail'] = this.thumbnail ?? undefined;
      s.character['exp'] = {
          total: this.exp.total,
          current: this.exp.current,    
      };
      //s.character['history'] = this.history;
      return s;
  }
}