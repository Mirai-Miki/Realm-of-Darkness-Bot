'use strict';

const Consumable = require("../structures/Consumable");
const StaticField = require("../structures/StaticField");
const Character20th = require("./base/Character20th");

module.exports = class Vampire20th extends Character20th
{
    constructor(humanity=7, blood=10, willpower=6) 
    {
        super(willpower);
        this.splat = 'Vampire';
        this.morality = {
            name: 'Humanity', 
            pool: new StaticField(humanity, 0, 10)
        };
        this.blood = new Consumable(blood);
    }

    static getSplat()
    {
        return ("Vampire20th");
    }

    deserilize(json)
    {
        super.deserilize(json);
        this.morality.pool.setCurrent(json.character.morality.current);
        this.morality.name = json.character.morality.name;
        this.blood.setTotal(json.character.blood.total);
        this.blood.setCurrent(json.character.blood.current);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['morality'] = {
            name: this.morality.name,
            current: this.morality.pool.current,
        };
        s.character['blood'] = {
            total: this.blood.total,
            current: this.blood.current,
        };
        
        return s;
    }
}