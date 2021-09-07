'use strict';

const Consumable = require("../structures/Consumable");
const DamageTracker20th = require("../structures/DamageTracker20th");
const StaticField = require("../structures/StaticField");
const Character20th = require("./Character20th");

module.exports = class Changeling20 extends Character20th
{
    constructor(glamour=4, banality=3, willpower=4, nightmare=0, imbalence=0) 
    {
        super(willpower);
        this.splat = 'Changeling';
        this.glamour = new Consumable(glamour);
        this.banality = new Consumable(banality);
        this.nightmare = new StaticField(nightmare, 0, 10);
        this.imbalence = new StaticField(imbalence, 0, 10);
        this.chimericalHealth = new DamageTracker20th();
    }

    resetOverflows()
    {
        super.resetOverflows();
        this.glamour.resetOverflow();
        this.banality.resetOverflow();
        this.nightmare.resetOverflow();
        this.imbalence.resetOverflow();
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.glamour.setTotal(char.glamour.total);
        this.banality.setTotal(char.banality.total);
        this.glamour.setCurrent(char.glamour.current);
        this.banality.setCurrent(char.banality.current);

        this.nightmare.setCurrent(char.nightmare.current);
        this.imbalence.setCurrent(char.imbalence.current);

        this.chimericalHealth.setBashing(char.chimericalHealth.bashing);
        this.chimericalHealth.setLethal(char.chimericalHealth.lethal);
        this.chimericalHealth.setAgg(char.chimericalHealth.aggravated);
    }
}