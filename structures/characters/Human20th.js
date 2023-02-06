'use strict';
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../Constants');

module.exports = class Human20th extends Character20th
{
    constructor(interaction, humanity=7, willpower=6) 
    {
        super(interaction, willpower);
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
        this.morality.pool.setCurrent(char.morality);
        this.blood.setCurrent(char.blood);
        return this;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.human20th;        
        s.character['morality'] = this.morality.pool.current;
        s.character['blood'] = this.blood.current;
        
        return s;
    }
}