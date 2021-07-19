const MAX_DAMAGE = 7;

module.exports = class DamageTracker20th
{
    constructor()
    {
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
        let total = this.getTotal()
        if (total > MAX_DAMAGE) 
            this.bashing = this.bashing - (total - MAX_DAMAGE);
    }

    updateLethal(amount)
    {
        this.lethal += amount;

        if (this.lethal < 0) this.lethal = 0;
        let total = this.getTotal()
        if (total > MAX_DAMAGE) 
            this.lethal = this.lethal - (total - MAX_DAMAGE);
    }

    updateAgg(amount)
    {
        this.aggravated += amount;

        if (this.aggravated < 0) this.aggravated = 0;
        let total = this.getTotal()
        if (total > MAX_DAMAGE) 
            this.aggravated = this.aggravated - (total - MAX_DAMAGE);
    }

    setBashing(amount)
    {
        this.bashing = amount;
    }

    setLethal(amount)
    {
        this.lethal = amount;
    }

    setAgg(amount)
    {
        this.aggravated = amount;
    }

    getTotal()
    {
        let total = this.bashing + this.lethal + this.aggravated;
        if (total > MAX_DAMAGE) this.overflow += total - MAX_DAMAGE;
        return total
    }
}