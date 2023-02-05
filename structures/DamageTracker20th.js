'use strict';

module.exports = class DamageTracker20th
{
    constructor()
    {
        this.total = 7;
        this.bashing = 0;
        this.lethal = 0;
        this.aggravated = 0;
        this.overflow = 0;
    }

    resetOverflow()
    {
        this.overflow = 0;
    }

    updateBashing(amount)
    {
        this.bashing += amount;

        if (this.bashing < 0) this.bashing = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.bashing = this.bashing - (total - this.total);
    }

    updateLethal(amount)
    {
        this.lethal += amount;

        if (this.lethal < 0) this.lethal = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.lethal = this.lethal - (total - this.total);
    }

    updateAgg(amount)
    {
        this.aggravated += amount;

        if (this.aggravated < 0) this.aggravated = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.aggravated = this.aggravated - (total - this.total);
    }

    setBashing(amount)
    {
        this.bashing = amount;
        if (this.bashing < 0) this.bashing = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.bashing = this.bashing - (total - this.total);
    }

    setLethal(amount)
    {
        this.lethal = amount;

        if (this.lethal < 0) this.lethal = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.lethal = this.lethal - (total - this.total);
    }

    setAgg(amount)
    {
        this.aggravated = amount;

        if (this.aggravated < 0) this.aggravated = 0;
        let total = this.getTotalDamage()
        if (total > this.total) 
            this.aggravated = this.aggravated - (total - this.total);
    }

    updateCurrent(amount)
    {
        this.total += amount;
        if (this.total < 7) this.total = 7;
        else if (this.total > 15) this.total = 15;
    }

    setTotal(amount)
    {
        this.total = amount;
        if (this.total < 7) this.total = 7;
        else if (this.total > 15) this.total = 15;
    }

    getTotalDamage()
    {
        let total = this.bashing + this.lethal + this.aggravated;
        if (total > this.total) this.overflow += total - this.total;
        return total
    }
}