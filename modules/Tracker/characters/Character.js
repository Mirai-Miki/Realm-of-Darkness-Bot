'use strict';
const Consumable = require("../structures/Consumable");

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

    updateHistory(args, notes, mode)
    {
        this.setUpdateDate();
        const dateObj = new Date(Date.now());
        const date = dateObj.toDateString();        
        const argStr = [];
        
        for (const key of Object.keys(args))
        {
            const value = args[key];

            if (value) argStr.push(`${key}: ${value}`);
        } 
        const content = `**${mode} Character** - ${date}\n\`\`\`\nArgs: ` +
            `[${argStr.join(', ')}]\n\`\`\`` +
            `${notes ? 'Notes: ' + notes : ''}`;
        
        this.history.push(content);
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
        if (json.exp) 
        {
            this.exp.setTotal(json.exp.total);
            this.exp.setCurrent(json.exp.current);
        }
        if (json.history) this.history = json.history;        
    }
}