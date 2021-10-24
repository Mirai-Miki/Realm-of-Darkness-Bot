'use strict';

const DamageTracker5th = require("../../structures/DamageTracker5th");
const Character = require("./Character.js");

module.exports = class Character5th extends Character
{
    constructor(interaction, health, willpower) 
    {
        super(interaction);
        this.version = '5th';
        this.willpower = new DamageTracker5th(willpower);
        this.health = new DamageTracker5th(health);
    }

    deserilize(char)
    {
        super.deserilize(char);
        
        this.willpower.setTotal(char.willpower.total);
        this.willpower.takeSuperfical(char.willpower.superficial);
        this.willpower.takeAgg(char.willpower.aggravated);

        this.health.setTotal(char.health.total);
        this.health.takeSuperfical(char.health.superficial);
        this.health.takeAgg(char.health.aggravated);
    }

    serialize()
    {
        const s = super.serialize();

        s.character['version'] = this.version;
        s.character['willpower'] = {
            total: this.willpower.total,
            superficial: this.willpower.superficial,
            aggravated: this.willpower.aggravated,
        };
        s.character['health'] = {
            total: this.health.total,
            superficial: this.health.superficial,
            aggravated: this.health.aggravated,
        };
        return s
    }
}