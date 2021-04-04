const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./Character20th");

module.exports = class Ghoul20th extends Character20th
{
    constructor(humanity=7, willpower=6, vitae=1) 
    {
        super(willpower);
        this.splat = 'Ghoul';
        this.humanity = new StaticField(humanity, 0, 10);
        this.blood = new Consumable(10);
        this.vitae = new Consumable(5, vitae);
    }

    resetOverflows()
    {
        super.resetOverflows();
        this.blood.resetOverflow();
        this.humanity.resetOverflow();
        this.vitae.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.humanity.setCurrent(char.humanity.current);
        this.blood.setCurrent(char.blood.current);
        this.vitae.setCurrent(char.vitae.current);
    }
}