'use strict';
const Consumable = require("../Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../Constants');

module.exports = class Mage extends Character20th 
{
    constructor(interaction, arete=1, quintessence=5, paradox=0, willpower=5) 
    {
        super(interaction, willpower);
        this.splat = 'Mage';
        this.arete = new Consumable(10, arete, 0);
        this.quintParadox = new Consumable((20 - paradox), quintessence, 0);
    }

    static getSplat()
    {
        return Splats.mage20th;
    }

    updateQuint(amount)
    {
        this.quintParadox.updateCurrent(amount);
    }

    setQuint(amount)
    {
        this.quintParadox.setCurrent(amount);
    }

    updateParadox(amount)
    {
        const total = this.quintParadox.total;
        const update = total - amount;

        if (update > 20) update = 20;
        else if (update < 0) update = 0;

        this.quintParadox.setTotal(update, false);
    }

    setParadox(amount)
    {
        this.quintParadox.setTotal(20 - amount, false);
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.arete.setCurrent(char.arete);
        this.quintParadox.setCurrent(char.quint_paradox.current);
        this.quintParadox.setTotal(char.quint_paradox.total);
        return this;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.mage20th;        
        s.character['arete'] = this.arete.current;
        s.character['quint_paradox'] = {
            current: this.quintParadox.current,
            total: this.quintParadox.total,
        }
        
        return s;
    }
}