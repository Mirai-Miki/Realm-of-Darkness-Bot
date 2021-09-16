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
        this.morality.pool.setCurrent(json.morality.current);
        this.morality.name = json.morality.name;
        this.blood.setTotal(json.blood.total);
        this.blood.setCurrent(json.blood.current);
    }

    serialize()
    {
        const s = {};

        s['name'] = this.name;
        s['user'] = this.user;
        s['guild'] = this.guild;
        s['splat'] = this.splat;
        s['version'] = this.version;
        s['colour'] = this.colour;
        s['thumbnail'] = this.thumbnail;
        s['exp'] = {
            total: this.exp.total,
            current: this.exp.current,    
        };
        s['history'] = this.history;
        s['willpower'] = {
            total: this.willpower.total,
            current: this.willpower.current,
        };
        s['health'] = {
            total: this.health.total,
            bashing: this.health.bashing,
            lethal: this.health.lethal,
            aggravated: this.health.aggravated,
        };
        s['morality'] = {
            name: this.morality.name,
            current: this.morality.pool.current,
        };
        s['blood'] = {
            total: this.blood.total,
            current: this.blood.current,
        };
        
        return s;
    }
}