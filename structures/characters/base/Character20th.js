'use strict';
const Character = require("./Character.js");
const Consumable = require("../../Consumable");
const DamageTracker20th = require("../../DamageTracker20th");

module.exports = class Character20th extends Character
{
    constructor(interaction, willpower)
    {
        super(interaction);
        this.version = '20th';
        this.willpower = new Consumable(willpower);
        this.health = new DamageTracker20th();
    }

    deserilize(json)
    {
        super.deserilize(json);
        this.willpower.setTotal(json.willpower.total);
        this.willpower.setCurrent(json.willpower.current);
        if (json.health.total) this.health.setTotal(json.health.total);
        this.health.setBashing(json.health.bashing);
        this.health.setLethal(json.health.lethal);
        this.health.setAgg(json.health.aggravated);
        return this;
    }

    serialize()
    {
        const s = super.serialize();

        s.character['version'] = this.version;
        s.character['willpower'] = {
            total: this.willpower.total,
            current: this.willpower.current,
        };
        s.character['health'] = {
            total: this.health.total,
            bashing: this.health.bashing,
            lethal: this.health.lethal,
            aggravated: this.health.aggravated,
        };
        return s
    }
}