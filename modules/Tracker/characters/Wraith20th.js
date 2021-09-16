'use strict';

const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./base/Character20th");

module.exports = class Wraith20 extends Character20th 
{
    constructor(corpus=10, pathos=5, willpower=6) 
    {
        super(willpower);
        this.splat = 'Wraith';
        this.corpus = new Consumable(corpus);
        this.pathos = new StaticField(pathos, 0, 10);
    }

    static getSplat()
    {
        return ("Wraith20th");
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.corpus.setTotal(char.corpus.total);
        this.corpus.setCurrent(char.corpus.current);
        this.pathos.setCurrent(char.pathos.current);
    }
}