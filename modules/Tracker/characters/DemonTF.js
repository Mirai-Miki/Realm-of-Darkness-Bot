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
        this.torment = new Consumable(6, 0, 0);

        this.torment.unlock(10);
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
        this.tormentPerm.setCurrent(char.tormentPerm.current);
        this.tormentTemp.setCurrent(char.tormentTemp.current);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = this.splat;        
        s.character['faith'] = {
            total: this.faith.total,
            current: this.faith.current,
        };
        s.character['torment'] = { 
            total: this.torment.total,
            current: this.torment.current,
        }
        
        return s;
    }
}