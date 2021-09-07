'use strict';

const Consumable = require("../structures/Consumable");

module.exports = class Character 
{
    constructor() 
    {
        this.name;
        this.owner = {};
        this.guild;
        this.updateDate;
        this.exp = new Consumable(0);
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

    setOwner(recvMess)
    {
        this.owner.id = recvMess.author.id;
        this.owner.avatarURL = recvMess.author.avatarURL();
        if (recvMess.member) this.owner.username = recvMess.member.displayName;
        else this.owner.username = recvMess.author.username;      
    }

    setGuild(guildID)
    {
        this.guild = guildID;
    }

    setName(name)
    {
        this.name = name;
    }

    updateHistory(keys, notes, mode)
    {
        let dateObj = new Date(Date.now());
        let date = dateObj.toDateString()
        let content = `**${mode} Character** - ${date}\n\`\`\`\nKeys: [`;
        let count = Object.keys(keys).length;
        
        for (const [key, value] of Object.entries(keys))
        {
            if (count != 1) content += `${key}: ${value}, `;
            else content += `${key}: ${value}]`;
            count--;
        }        
        if (notes) content += `\nNotes: ${notes}`;
        content += '\n```';
        this.history.push(content);

        if (this.history.length > 10) this.history.shift();
    }

    deserilize(char)
    {
        this.name = char.name;
        this.colour = char.colour;
        this.guild = char.guild;
        this.updateDate = char.updateDate;
        if (char.exp) this.exp.setTotal(char.exp.total);
        if (char.exp) this.exp.setCurrent(char.exp.current);
        if (char.history) this.history = char.history;

        // Set owner. Must handle old owner format.       
        if (typeof(char.owner) == 'string') this.owner.id = char.owner;
        else
        {
            this.owner.id = char.owner.id;
            this.owner.username = char.owner.username;
            this.owner.avatarURL = char.owner.avatarURL;
        }
    }
}