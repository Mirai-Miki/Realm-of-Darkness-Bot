'use strict';

const Character20th = require("./base/Character20th.js");
const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");

module.exports = class DemonTF extends Character20th
{
    constructor(permTorment=1, faith=3, willpower=6) 
    {
        super(willpower);
        this.splat = 'Demon';          
        this.faith = new Consumable(1);
        this.permTorment = new StaticField(1, 1, 10);
        this.tempTorment = new StaticField(0, 0, 10);
    }

    static getSplat()
    {
        return ('Demon20th');
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.faith.setTotal(char.faith.total);
        this.faith.setCurrent(char.faith.current);
        this.permTorment.setCurrent(char.permTorment.current);
        this.tempTorment.setCurrent(char.tempTorment.current);
    }
}