'use strict';
const Consumable = require("../structures/Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Wraith20 extends Character20th 
{
    constructor(interaction, corpus=10, pathos=5, willpower=6) 
    {
        super(interaction, willpower);
        this.splat = 'Wraith';
        this.corpus = new Consumable(corpus, corpus, 0);
        this.pathos = new Consumable(10, pathos, 0);
    }

    static getSplat()
    {
        return Splats.wraith20th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.corpus.setTotal(char.corpus.total);
        this.corpus.setCurrent(char.corpus.current);
        this.pathos.setCurrent(char.pathos);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['corpus'] = {
            totra: this.corpus.total,
            current: this.corpus.current,
        }
        s.character['gnosis'] = this.pathos.current;
        
        return s;
    }
}