module.exports = class Character 
{
    constructor() 
    {
        this.name;
        this.owner;
        this.guild;
        this.updateDate;
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
    }
}