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
        this.morality = {
            name: 'Humanity', 
            pool: new StaticField(humanity, 0, 10)
        };
        this.blood = new Consumable(blood);
    }

    deserilize(json)
    {
        super.deserilize(json);
        this.morality.pool.setCurrent(json.morality.current);
        this.morality.name = json.morality.name;
        this.blood.setTotal(json.blood.total);
        this.blood.setCurrent(json.blood.current);
    }
}