'use strict';
const Consumable = require("../structures/Consumable");
const Character5th = require("./base/Character5th");
const Humanity = require("../structures/humanity5th.js");
const { Splats } = require('../../util/Constants');

module.exports = class Mortal5th extends Character5th
{
    constructor(health=4, willpower=2, humanity=7) 
    {
        super(health, willpower);
        
        this.splat = 'Mortal';             
        this.humanity = new Humanity(humanity);
    }

    static getSplat()
    {
        return Splats.mortal5th;
    }

    deserilize(char)
    {
        super.deserilize(char);

        this.humanity = new Humanity(char.humanity.total);
        this.humanity.takeStains(char.humanity.stains);
        this.humanity.overflow = char.humanity.stainOverflow;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['humanity'] = {
            total: this.humanity.total,
            stains: this.humanity.stains,
            stainOverflow: this.humanity.overflow,
        }
        
        return s;
    }
}