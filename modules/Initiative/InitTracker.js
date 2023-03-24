'use strict'
const { Collection } = require("discord.js");
const { InitCharacter } = require("../../structures/InitiativeCharacter.js")

module.exports.InitTracker = class InitTracker
{
    constructor()
    {
        this.channelId = "";
        this.guildId = "";
        this.messageId = "";
        this.phase = "";
        this.currentRound = 1;
        this.characters = new Collection();
    }

    async fetchMembers(guild)
    {
        let ids = []
        this.characters.forEach((character) => {
            ids.push(character.memberId)          
        });
        
        let members;
        try
        {
            if (ids.length)
            {   
                members = await guild.members.fetch({user: ids});
            }           
        }
        catch(error)
        {
            throw new FetchMemberError();
        }
        
        this.characters.forEach((character) => {
            character.member = members.get(character.memberId)
        });
        return this;
    }

    rolledCount()
    {
        let count = 0;
        this.characters.forEach((character) => {
            if (character.rolled) count++;
        })
        return count;
    }

    fromJSON(json)
    {
        for(const character of json.characters)
        {
            this.characters
                .set(`${character.memberId}#${character.name.toLowerCase()}`, 
                new InitCharacter(character));
        }

        this.channelId = json.channelId;
        this.guildId = json.guildId;
        this.messageId = json.messageId;
        this.phase = json.phase;
        this.currentRound = json.currentRound;
        return this;
    }

    toJSON()
    {
        const characters = [];

        this.characters.forEach((character) => {
            characters.push({
                memberId: character.memberId,
                name: character.name,
                rolled: character.rolled,
                pool: character.pool,
                mod: character.mod,
                init: character.init,
                declared: character.declared,
                action: character.action
            })
        });

        return {
            channelId: this.channelId,
            guildId: this.guildId,
            messageId: this.messageId,
            phase: this.phase,
            currentRound: this.currentRound,
            characters: characters
        }
    }
}

class FetchMemberError extends Error
{
    constructor() 
    {
        super("Could not Fetch Guild Members!");
        this.name = "FetchMemberError";
    }
}