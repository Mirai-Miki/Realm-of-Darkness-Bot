'use strict';

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
        this.overflow = 0;
        this.stains += amount;
        this.calculateStainsOverflow();
    }

    setStains(amount)
    {
        this.overflow = 0;

        if (amount < 0)
        {
            // Should never be less then 0
            return;
        }
        else
        {
            this.stains = amount;
            this.calculateStainsOverflow();
        }
    }

    setCurrent(amount)
    {
        this.overflow = 0;
        
        // If the player is losing humanity then stains get reset
        if (amount < this.total) this.stains = 0;
        
        this.total = amount;
        
        if (this.total > 10) this.total = 10;
        if (this.total < 0) this.total = 0;

        this.calculateStainsOverflow();        
    }

    updateCurrent(amount)
    {
        this.overflow = 0;

        // If the player is losing humanity then stains get reset
        if (amount < 0) this.stains = 0;

        this.total += amount;

        if (this.total > 10) this.total = 10;
        if (this.total < 0) this.total = 0;

        this.calculateStainsOverflow();  
    }

    calculateStainsOverflow()
    {
        if (this.stains > (10 - this.total))
        {
            this.overflow = this.stains - (10 - this.total);
            this.stains = (10 - this.total);
        }
    }
}