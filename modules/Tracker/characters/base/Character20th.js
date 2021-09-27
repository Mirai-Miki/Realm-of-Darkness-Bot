'use strict';
const DamageTracker20th = require("../../structures/DamageTracker20th");
const Consumable = require("../../structures/Consumable");
const Character = require("./Character.js");

module.exports = class Character20th extends Character
{
    constructor(willpower)
    {
        super();
        this.version = '20th';
        this.willpower = new Consumable(willpower);
        this.health = new DamageTracker20th();
    }

    deserilize(json)
    {
        super.deserilize(json);
        this.willpower.setTotal(json.character.willpower.total);
        this.willpower.setCurrent(json.character.willpower.current);
        if (json.health.total) this.health.setTotal(json.character.health.total);
        this.health.setBashing(json.character.health.bashing);
        this.health.setLethal(json.character.health.lethal);
        this.health.setAgg(json.character.health.aggravated);
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