const DamageTracker20th = require("../structures/DamageTracker20th");
const Consumable = require("../structures/Consumable");
const Character = require("./Character.js");

module.exports = class Character20th extends Character
{
    constructor(willpower)
    {
        super();
        this.willpower = new Consumable(willpower);
        this.health = new DamageTracker20th();
    }
}