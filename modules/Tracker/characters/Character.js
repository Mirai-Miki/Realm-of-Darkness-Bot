const Consumable = require("../structures/Consumable");

module.exports = class Character 
{
    constructor() 
    {
        this.name;
        this.owner;
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

    setOwner(ownerID)
    {
        this.owner = ownerID;
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
        this.owner = char.owner;
        this.guild = char.guild;
        this.updateDate = char.updateDate;
        if (char.exp) this.exp.setTotal(char.exp.total);
        if (char.exp) this.exp.setCurrent(char.exp.current);
        if (char.history) this.history = char.history;
    }
}