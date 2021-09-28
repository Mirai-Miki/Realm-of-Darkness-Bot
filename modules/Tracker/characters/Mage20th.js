'use strict';

const StaticField = require("../structures/StaticField");
const Character20th = require("./base/Character20th");

module.exports = class Mage20 extends Character20th 
{
    constructor(arete=1, quintessence=5, paradox=0, willpower=5) 
    {
        super(willpower);
        this.splat = 'Mage';
        this.arete = new StaticField(arete, 0, 10);
        this.quintessence = new StaticField(quintessence, 0, 10);
        this.paradox = new StaticField(paradox, 0, 10);
    }

    static getSplat()
    {
        return ("mage20th");
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.arete.setCurrent(char.arete.current);
        this.quintessence.setCurrent(char.quintessence.current);
        this.paradox.setCurrent(char.paradox.current);
    }
}