'use strict';

const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./Character20th");

module.exports = class Vampire20th extends Character20th
{
    constructor(humanity=7, blood=10, willpower=6) 
    {
        super(willpower);
        this.splat = 'Vampire';
        this.humanity = new StaticField(humanity, 0, 10);
        this.blood = new Consumable(blood);
    }

    resetOverflows()
    {
        super.resetOverflows();
        this.blood.resetOverflow();
        this.humanity.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.humanity.setCurrent(char.humanity.current);
        this.blood.setTotal(char.blood.total);
        this.blood.setCurrent(char.blood.current);
    }
}