const DamageTracker5th = require("../structures/DamageTracker5th");
const Character = require("./Character.js");

module.exports = class Character5th extends Character
{
    constructor(health, willpower) 
    {
        super();
        this.version = 'v5';
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
}