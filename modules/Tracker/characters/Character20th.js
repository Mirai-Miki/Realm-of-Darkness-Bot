'use strict';

const DamageTracker20th = require("../structures/DamageTracker20th");
const Consumable = require("../structures/Consumable");
const Character = require("./Character.js");

module.exports = class Character20th extends Character
{
    constructor(willpower)
    {
        super();
        this.version = 'v20';
        this.willpower = new Consumable(willpower);
        this.health = new DamageTracker20th();
    }

    resetOverflows()
    {
        this.health.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.willpower.setTotal(char.willpower.total);
        this.willpower.setCurrent(char.willpower.current);
        if (char.health.total) this.health.setTotal(char.health.total);
        this.health.setBashing(char.health.bashing);
        this.health.setLethal(char.health.lethal);
        this.health.setAgg(char.health.aggravated);
    }
}