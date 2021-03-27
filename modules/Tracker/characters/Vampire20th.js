const Consumable = require("../structures/Consumable");
const Character20th = require("./Character20th");

module.exports = class Vampire20 extends Character20th
{
    constructor(humanity=7, blood=10, willpower=6) 
    {
        super(willpower);
        this.splat = 'Vampire';
        this.humanity = humanity;
        this.blood = new Consumable(blood);
    }

    setHumanity(amount)
    {
        this.humanity = amount;
    }

    resetOverflows()
    {
        super.resetOverflows();
        this.blood.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.humanity = char.humanity;
        this.blood.setTotal(char.blood.total);
        this.blood.setCurrent(char.blood.current);
    }
}