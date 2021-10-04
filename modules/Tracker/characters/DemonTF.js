'use strict';
const Character20th = require("./base/Character20th.js");
const Consumable = require("../structures/Consumable");
const { Splats } = require('../../util/Constants');

module.exports = class DemonTF extends Character20th
{
    constructor(interaction, willpower=6) 
    {
        super(interaction, willpower);
        this.splat = 'Demon';          
        this.faith = new Consumable(10, 6, 1);
        this.torment = {permanant: 0, temporary: 0};
    }

    static getSplat()
    {
        return Splats.demonTF;
    }

    setTorment(amount)
    {
        if (amount > 10) amount = 10;
        else if (amount < 0) amount = 0;
        this.torment.permanant = amount;
    }

    updateTorment(amount)
    {
        this.torment.temporary += amount;

        if (this.torment.temporary < 0) 
        {
            this.torment.temporary = 0;
        }
        else if (this.torment.temporary > 9)
        {
            this.torment.permanant++;
            if (this.torment.permanant > 10) this.torment.permanant = 10;
            this.torment.temporary = 0;
        }
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.faith.setTotal(char.faith.total);
        this.faith.setCurrent(char.faith.current);
        this.torment.permanant = char.torment.total;
        this.torment.temporary = char.torment.current;
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