'use strict';
const Consumable = require("../Consumable");
const Counter = require("../Counter");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../Constants');

module.exports = class DemonTF extends Character20th
{
    constructor(interaction, willpower=6) 
    {
        super(interaction, willpower);
        this.splat = 'Demon';          
        this.faith = new Consumable(10, 6, 1);
        this.torment = new Counter(5, 0);
    }

    static getSplat()
    {
        return Splats.demonTF;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.faith.setTotal(char.faith.total);
        this.faith.setCurrent(char.faith.current);
        this.torment.setPermanant(char.torment.total);
        this.torment.setTemporary(char.torment.current);
        return this;
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.demonTF;        
        s.character['faith'] = {
            total: this.faith.total,
            current: this.faith.current,
        };
        s.character['torment'] = { 
            total: this.torment.permanant,
            current: this.torment.temporary,
        }
        
        return s;
    }
}