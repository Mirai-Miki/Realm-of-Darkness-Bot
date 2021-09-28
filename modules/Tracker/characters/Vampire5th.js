'use strict';

const Consumable = require("../structures/Consumable");
const Character5th = require("./base/Character5th");
const Humanity = require("../structures/humanity5th.js");

module.exports = class Vampire5th extends Character5th
{
    constructor(health=4, willpower=2, humanity=7) 
    {
        super(health, willpower);
        
        this.splat = 'Vampire';
        this.hunger = new Consumable(5, 1);              
        this.humanity = new Humanity(humanity);
    }

    static getSplat()
    {
        return ("vampire5th");
    }

    deserilize(char)
    {
        super.deserilize(char);

        this.hunger.setCurrent(char.hunger.current);
        this.humanity = new Humanity(char.humanity.total);
        this.humanity.takeStains(char.humanity.stains);
        this.humanity.overflow = char.humanity.overflow;
    }
}