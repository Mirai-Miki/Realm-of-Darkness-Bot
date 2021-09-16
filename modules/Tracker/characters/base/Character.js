'use strict';
const Consumable = require("../../structures/Consumable");

module.exports = class Character 
{
    constructor() 
    {
        this.name;
        this.user = {id: '', username: '', discriminator: '', avatar: ''};
        this.guild = {id: '', name: '', memberName: ''};
        this.updateDate;
        this.exp = new Consumable(0);
        this.thumbnail;
        this.colour = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ]
        this.history = [];
    }

    setUpdateDate()
    {
        this.updateDate = Date.now();
    }

    setUser(interaction)
    {
        this.user.id = interaction.user.id;
        this.user.discriminator = interaction.user.discriminator;
        this.user.avatar = interaction.user.avatarURL();    
    }

    setGuild(interaction)
    {
        if (interaction.guild)
        {
            this.guild.id = interaction.guildId;
            this.guild.name = interaction.guild.name;
            this.guild.memberName = interaction.member?.displayName;
        }
    }

    setName(name)
    {
        this.name = name;
    }

    updateHistory(charArgs, notes, mode)
    {
        this.setUpdateDate();        
        
        const dateObj = new Date(Date.now());
        const date = dateObj.toDateString();
        const history = {date: date, args: {}, notes: '', mode: ''};
        
        for (const key of Object.keys(charArgs))
        {
            const value = charArgs[key];

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
        this.name = json.name;
        this.guild = json.guild;
        this.colour = json.colour; 
        this.thumbnail = json.thumbnail;       
        this.updateDate = json.updateDate;
        this.exp.setTotal(json.exp.total);
        this.exp.setCurrent(json.exp.current);
        this.history = json.history;        
    }
}