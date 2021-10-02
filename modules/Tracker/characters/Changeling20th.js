'use strict';
const Consumable = require("../structures/Consumable");
const DamageTracker20th = require("../structures/DamageTracker20th");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Changeling extends Character20th
{
    constructor(glamour=4, banality=3, willpower=4, nightmare=0, imbalence=0) 
    {
        super(willpower);
        this.splat = 'Changeling';
        this.glamour = new Consumable(glamour, glamour, 1);
        this.banality = new Consumable(banality, banality, 1);
        this.nightmare = new Consumable(10, nightmare, 0);
        this.imbalence = new Consumable(10, imbalence, 0);
        this.chimericalHealth = new DamageTracker20th();
    }
    
    static getSplat()
    {
        return Splats.changeling20th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.glamour.setTotal(char.glamour.total);
        this.banality.setTotal(char.banality.total);
        this.glamour.setCurrent(char.glamour.current);
        this.banality.setCurrent(char.banality.current);

        this.nightmare.setCurrent(char.nightmare);
        this.imbalence.setCurrent(char.imbalence);

        this.chimericalHealth.setTotal(char.chimericalHealth.total);
        this.chimericalHealth.setBashing(char.chimericalHealth.bashing);
        this.chimericalHealth.setLethal(char.chimericalHealth.lethal);
        this.chimericalHealth.setAgg(char.chimericalHealth.aggravated);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['glamour'] = {
            total: this.glamour.total,
            current: this.glamour.current,
        };
        s.character['banality'] = {
            total: this.banality.total,
            current: this.banality.current,
        };
        s.character['nightmare'] = this.nightmare.current;
        s.character['imbalence'] = this.imbalence.current;
        s.character['chimericalHealth'] = {
            total: this.chimericalHealth.total,
            bashing: this.chimericalHealth.bashing,
            lethal: this.chimericalHealth.lethal,
            aggravated: this.chimericalHealth.aggravated,
        };
        
        return s;
    }
}