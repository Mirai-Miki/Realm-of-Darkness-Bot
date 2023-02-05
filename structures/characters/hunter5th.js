'use strict';
const Consumable = require("../Consumable");
const Character5th = require("./base/Character5th");
const { Splats } = require('../../Constants');
const { EmbedBuilder } = require('discord.js');

module.exports = class Hunter5th extends Character5th
{
    constructor(interaction, health=4, willpower=2) 
    {
        super(interaction, health, willpower);
        
        this.splat = 'Hunter';
        // Desperation is shared stat between coterie
        this.desperation = new Consumable(5, 1, 1);
        // Danger is a shared stat between coterie   
        this.danger = new Consumable(5, 1, 1);
        // Despair is a boolean state triggered by rolling with desperation
        this.despair = false;
    }

    static getSplat()
    {
        return Splats.hunter5th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.desperation.setCurrent(char.desperation);
        this.danger.setCurrent(char.danger);
        this.despair = char.despair;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.hunter5th;
        s.character['desperation'] = this.desperation.current;
        s.character['danger'] = this.danger.current;
        s.character['despair'] = this.despair;
        
        return s;
    }
}