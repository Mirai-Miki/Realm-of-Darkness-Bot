'use strict';

const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./base/Character20th");

module.exports = class Human20th extends Character20th
{
    constructor(humanity=7, willpower=6) 
    {
        super(willpower);
        this.splat = 'Human';
        this.humanity = new StaticField(humanity, 0, 10);
        this.blood = new Consumable(10);
    }

    static getSplat()
    {
        return ("human20th");
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.humanity.setCurrent(char.humanity.current);
        this.blood.setCurrent(char.blood.current);
    }
}