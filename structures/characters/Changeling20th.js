'use strict';
const Consumable = require("../Consumable");
const Counter = require("../Counter");
const DamageTracker20th = require("../DamageTracker20th");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../Constants');

module.exports = class Changeling extends Character20th
{
    constructor(interaction, glamour=4, banality=3, willpower=4, nightmare=0, imbalance=0) 
    {
        super(interaction, willpower);
        this.splat = 'Changeling';
        this.glamour = new Consumable(glamour, glamour, 1);
        this.banality = new Counter(banality, 0);
        this.nightmare = new Counter(imbalance, nightmare);
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
        this.glamour.setCurrent(char.glamour.current);
        this.banality.setPermanant(char.banality.total);
        this.banality.setTemporary(char.banality.current);
        this.nightmare.setPermanant(char.imbalance);
        this.nightmare.setTemporary(char.nightmare);        

        this.chimericalHealth.setTotal(char.chimerical.total);
        this.chimericalHealth.setBashing(char.chimerical.bashing);
        this.chimericalHealth.setLethal(char.chimerical.lethal);
        this.chimericalHealth.setAgg(char.chimerical.aggravated);
        return this;
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
            total: this.banality.permanant,
            current: this.banality.temporary,
        };
        s.character['nightmare'] = this.nightmare.temporary;
        s.character['imbalance'] = this.nightmare.permanant;
        s.character['chimerical'] = {
            total: this.chimericalHealth.total,
            bashing: this.chimericalHealth.bashing,
            lethal: this.chimericalHealth.lethal,
            aggravated: this.chimericalHealth.aggravated,
        };
        
        return s;
    }
}