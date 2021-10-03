'use strict';
const Consumable = require("../structures/Consumable");
const DamageTracker20th = require("../structures/DamageTracker20th");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Changeling extends Character20th
{
    constructor(interaction, glamour=4, banality=3, willpower=4, nightmare=0, imbalance=0) 
    {
        super(interaction, willpower);
        this.splat = 'Changeling';
        this.glamour = new Consumable(glamour, glamour, 1);
        this.banality = new Consumable(banality, banality, 1);
        this.nightmare = new Consumable(10, nightmare, 0);
        this.imbalance = new Consumable(10, imbalance, 0);
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
        this.imbalance.setCurrent(char.imbalance);

        this.chimericalHealth.setTotal(char.chimerical.total);
        this.chimericalHealth.setBashing(char.chimerical.bashing);
        this.chimericalHealth.setLethal(char.chimerical.lethal);
        this.chimericalHealth.setAgg(char.chimerical.aggravated);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.changeling20th;        
        s.character['glamour'] = {
            total: this.glamour.total,
            current: this.glamour.current,
        };
        s.character['banality'] = {
            total: this.banality.total,
            current: this.banality.current,
        };
        s.character['nightmare'] = this.nightmare.current;
        s.character['imbalance'] = this.imbalance.current;
        s.character['chimerical'] = {
            total: this.chimericalHealth.total,
            bashing: this.chimericalHealth.bashing,
            lethal: this.chimericalHealth.lethal,
            aggravated: this.chimericalHealth.aggravated,
        };
        
        return s;
    }
}