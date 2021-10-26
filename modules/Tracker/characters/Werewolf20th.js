'use strict';
const Consumable = require("../structures/Consumable");
const Character20th = require("./base/Character20th");
const { Splats } = require('../../util/Constants');

module.exports = class Werewolf20th extends Character20th 
{
    constructor(interaction, rage=7, gnosis=7, willpower=6) 
    {
        super(interaction, willpower);
        this.splat = 'Werewolf';
        this.rage = new Consumable(rage, rage, 0);
        this.gnosis = new Consumable(gnosis, gnosis, 0);

        this.rage.unlock(10);
    }

    static getSplat()
    {
        return Splats.werewolf20th;
    }

    deserilize(char)
    {
        super.deserilize(char);
        this.rage.setTotal(char.rage.total);
        this.rage.setCurrent(char.rage.current);
        this.gnosis.setTotal(char.gnosis.total);
        this.gnosis.setCurrent(char.gnosis.current);
    }

    serialize()
    {        
        const s = super.serialize();
        
        s.character['splat'] = Splats.werewolf20th;        
        s.character['rage'] = {
            total: this.rage.total,
            current: this.rage.current,
        }
        s.character['gnosis'] = {
            total: this.gnosis.total,
            current: this.gnosis.current,
        }
        
        return s;
    }
}