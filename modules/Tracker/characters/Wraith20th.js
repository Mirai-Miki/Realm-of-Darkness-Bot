const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./Character20th");

module.exports = class Wraith20 extends Character20th 
{
    constructor(corpus=10, pathos=5, willpower=6) 
    {
        super(willpower);
        this.splat = 'Wraith';
        this.corpus = new Consumable(corpus);
        this.pathos = new StaticField(pathos, 0, 10);
    }

    resetOverflows()
    {
        super.resetOverflows();
        this.corpus.resetOverflow();
        this.pathos.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.corpus.setTotal(char.corpus.total);
        this.corpus.setCurrent(char.corpus.current);
        this.pathos.setCurrent(char.pathos.current);
    }
}