'use strict';
const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Human20th extends Character20th
{
    constructor(humanity=7, willpower=6) 
    {
        super(willpower);
        this.splat = 'Human';
        this.morality = {
            name: 'Humanity', 
            pool: new Consumable(10, humanity, 0),
        };
        this.blood = new Consumable(10, 10, 0);
    }

    static getSplat()
    {
        return Splats.human20th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.morality.pool.setTotal(char.morality);
        this.blood.setCurrent(char.blood);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['morality'] = this.morality.pool.current;
        s.character['blood'] = this.blood.current;
        s.character['vitae'] = this.vitae.current
        
        return s;
    }
}