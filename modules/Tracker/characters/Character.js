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
    }

    setDate(dateNow)
    {
        this.updateDate = dateNow;
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

    deserilize(char)
    {
        this.name = char.name;
        this.colour = char.colour;
        this.owner = char.owner;
        this.guild = char.guild;
        this.updateDate = char.updateDate;
        if (char.exp) this.exp.setTotal(char.exp.total);
        if (char.exp) this.exp.setCurrent(char.exp.current);
    }
}