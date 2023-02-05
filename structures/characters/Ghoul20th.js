'use strict';
const Consumable = require("../structures/Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Ghoul20th extends Character20th
{
    constructor(interaction, humanity=7, willpower=6, vitae=1) 
    {
        super(interaction, willpower);
        this.splat = 'Ghoul';
        this.morality = {
            name: 'Humanity', 
            pool: new Consumable(10, humanity, 0),
        };
        this.blood = new Consumable(10, 10, 0);
        this.vitae = new Consumable(5, vitae, 0);
    }

    static getSplat()
    {
        return Splats.ghoul20th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.morality.pool.setCurrent(char.morality);
        this.blood.setCurrent(char.blood);
        this.vitae.setCurrent(char.vitae);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.ghoul20th;        
        s.character['morality'] = this.morality.pool.current;
        s.character['blood'] = this.blood.current;
        s.character['vitae'] = this.vitae.current
        
        return s;
    }
}