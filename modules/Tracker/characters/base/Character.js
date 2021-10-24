'use strict';
const Consumable = require("../../structures/Consumable");

module.exports = class Character 
{
    constructor(interaction) 
    {
        this.name;
        this.id = null;
        this.user = {
            id: '', 
            username: '', 
            discriminator: '', 
            avatarURL: ''
        };
        this.guild = {
            id: '', 
            name: '', 
            iconURL: '', 
            displayName: ''
        };
        this.exp = new Consumable(0);
        this.thumbnail;
        this.colour = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ]
        this.history = [];
        this.interaction = interaction;
        this.setUser(this.interaction);
        this.setGuild(this.interaction);
    }

    setUser(interaction)
    {
        if (interaction)
        {
            this.user.id = interaction.user.id;
            this.user.username = interaction.user.username;
            this.user.discriminator = interaction.user.discriminator;
            this.user.avatarURL = interaction.user.avatarURL() ?? '';    
        }
    }

    setGuild(interaction)
    {
        if (interaction?.guild)
        {
            this.guild.id = interaction.guildId;
            this.guild.name = interaction.guild.name;
            this.guild.iconURL = interaction.guild.iconURL() ?? '';
            this.guild.displayName = interaction.member?.displayName;
        }
    }

    setName(name)
    {
        this.name = name;
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
        this.history = json.history;   
        
        if (!this.interaction)
        {
            this.user = json.user;
            this.guild = json.guild;
        }
    }

    serialize()
    {
        const s = {character: {}, user: {}, guild: {}};

        s.character['name'] = this.name;
        s.character['id'] = this.id;
        s.user = this.user;        
        s.guild = this.guild;        
        s.character['colour'] = this.colour;
        s.character['thumbnail'] = this.thumbnail ?? undefined;
        s.character['exp'] = {
            total: this.exp.total,
            current: this.exp.current,    
        };
        s.character['history'] = this.history;

        return s;
    }
}