'use strict';
const Consumable = require("../../structures/Consumable");

module.exports = class Character 
{
    constructor() 
    {
        this.name;
        this.id = null;
        this.user = {id: '', username: '', discriminator: '', avatarURL: ''};
        this.guild = {id: '', name: '', iconURL: '', displayName: ''};
        this.exp = new Consumable(0);
        this.thumbnail;
        this.colour = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ]
        this.history = [];
    }

    setUser(interaction)
    {
        this.user.id = interaction.user.id;
        this.user.username = interaction.user.username;
        this.user.discriminator = interaction.user.discriminator;
        this.user.avatarURL = interaction.user.avatarURL();    
    }

    setGuild(interaction)
    {
        if (interaction.guild)
        {
            this.guild.id = interaction.guildId;
            this.guild.name = interaction.guild.name;
            this.guild.iconURL = interaction.guild.iconURL();
            this.guild.displayName = interaction.member?.displayName;
        }
    }

    setName(name)
    {
        this.name = name;
    }

    updateHistory(charArgs, notes, mode)
    {
        const history = {args: {}, notes: '', mode: ''};
        
        for (const key of Object.keys(charArgs))
        {
            const value = charArgs[key];
            
            if (key === 'name') continue;
            if (value != null) history.args[key] = value;
        }
        
        history.notes = notes;
        history.mode = mode;
        this.history.push(history);
        if (this.history.length > 10) this.history.shift();
    }

    deserilize(json)
    {
        this.user = json.user;
        this.id = json.id;
        this.name = json.name;
        this.guild = json.guild;
        this.colour = json.colour; 
        this.thumbnail = json.thumbnail;
        this.exp.setTotal(json.exp.total);
        this.exp.setCurrent(json.exp.current); 
        this.history = json.history;        
    }

    serialize()
    {
        const s = {character: {}, user: {}, guild: {}};

        s.character['name'] = this.name;
        s.character['id'] = this.id;
        s.user = this.user;        
        s.guild = this.guild;        
        s.character['colour'] = this.colour;
        s.character['thumbnail'] = this.thumbnail;
        s.character['exp'] = {
            total: this.exp.total,
            current: this.exp.current,    
        };
        s.character['history'] = this.history;

        return s;
    }
}