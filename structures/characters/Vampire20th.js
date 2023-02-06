'use strict';
const { slugifiy } = require('../../modules/util/misc');
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../Constants');

module.exports = class Vampire20th extends Character20th
{
    constructor(interaction=null, humanity=7, blood=10, willpower=6) 
    {
        super(interaction, willpower);
        this.splat = 'Vampire';
        this.morality = {
            name: 'Humanity', 
            pool: new Consumable(10, humanity, 0),
        };
        this.blood = new Consumable(blood, blood, 0);
    }

    static getSplat()
    {
        return Splats.vampire20th;
    }

    deserilize(json)
    {
        super.deserilize(json);
        this.morality.pool.setCurrent(json.morality.current);
        this.morality.name = json.morality.name;
        this.blood.setTotal(json.blood.total);
        this.blood.setCurrent(json.blood.current);
        return this;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.vampire20th;        
        s.character['morality'] = {
            name: slugifiy(this.morality.name),
            current: this.morality.pool.current,
        };
        s.character['blood'] = {
            total: this.blood.total,
            current: this.blood.current,
        };
        
        return s;
    }
}