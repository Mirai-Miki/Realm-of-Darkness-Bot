'use strict';

const Consumable = require("../structures/Consumable");
const Character20th = require("./base/Character20th");

module.exports = class Werewolf20th extends Character20th 
{
    constructor(rage=7, gnosis=7, willpower=6) 
    {
        super(willpower);
        this.splat = 'Werewolf';
        this.rage = new Consumable(rage);
        this.gnosis = new Consumable(gnosis);
    }

    static getSplat()
    {
        return ("werewolf20th");
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.rage.setTotal(char.rage.total);
        this.rage.setCurrent(char.rage.current);
        this.gnosis.setTotal(char.gnosis.total);
        this.gnosis.setCurrent(char.gnosis.current);
    }
}