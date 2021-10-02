'use strict';
const Consumable = require("../structures/Consumable");
const Character5th = require("./base/Character5th");
const Humanity = require("../structures/humanity5th.js");
const { Splats } = require('../../util/Constants');

module.exports = class Vampire5th extends Character5th
{
    constructor(health=4, willpower=2, humanity=7) 
    {
        super(health, willpower);
        
        this.splat = 'Vampire';
        this.hunger = new Consumable(5, 1, 0);              
        this.humanity = new Humanity(humanity);
    }

    static getSplat()
    {
        return Splats.vampire5th;
    }

    deserilize(char)
    {
        super.deserilize(char);

        this.hunger.setCurrent(char.hunger);
        this.humanity = new Humanity(char.humanity.total);
        this.humanity.takeStains(char.humanity.stains);
        this.humanity.overflow = char.humanity.overflow;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['hunger'] = this.hunger.current;
        s.character['humanity'] = {
            total: this.humanity.total,
            stains: this.humanity.stains,
            stainOverflow: this.humanity.overflow,
        }
        
        return s;
    }
}