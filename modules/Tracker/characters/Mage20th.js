'use strict';
const Consumable = require("../structures/Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

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

        this.quintParadox.setTotal(update);
    }

    setParadox(amount)
    {
        this.quintParadox.setTotal(amount);
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.arete.setCurrent(char.arete);
        this.quintParadox.setCurrent(char.quintessence);
        this.quintParadox.setTotal(20 - char.paradox);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['arete'] = this.arete.current;
        s.character['quintessence'] = this.quintParadox.current;
        s.character['paradox'] = 20 - this.quintParadox.total;
        
        return s;
    }
}