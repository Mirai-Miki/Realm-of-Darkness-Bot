module.exports = class Humanity5th
{
    constructor(total)
    {
        this.total = total;
        this.stains = 0;
        this.overflow = 0;
    }

    takeStains(amount)
    {
        this.resetOverflow();
        if (amount === 0) this.stains = 0;
        else this.stains += amount;
        if (this.stains < 0) this.stains = 0;
        this.calculateStainsOverflow();
    }

    setTotal(amount)
    {
        this.resetOverflow();
        
        // If the player is losing humanity then stains get reset
        if (amount < this.total) this.stains = 0;
        
        this.total = amount;
        
        if (this.total > 10) this.total = 10;
        if (this.total < 0) this.total = 0;

        this.calculateStainsOverflow();        
    }

    resetOverflow()
    {
        this.overflow = 0;
    }

    calculateStainsOverflow()
    {
        if (this.stains > 10 - this.total)
        {
            this.overflow = this.stains - (10 - this.total);
            this.stains = (10 - this.total);
        }
    }
}