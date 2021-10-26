'use strict';

module.exports = class DamageTracker5th
{
    constructor(total, superficial=0, aggravated=0)
    {
        this.total = total;
        this.superficial = superficial;
        this.aggravated = aggravated;
    }

    takeSuperfical(amount)
    {
        if (amount > (this.total - this.aggravated - this.superficial)) 
        {
            // taking more superficial damage then is available
            // take agg damage as well.
            this.aggravated += (amount - (this.total - this.aggravated - 
                this.superficial));
            
            if (this.aggravated > this.total) this.aggravated = this.total;      
            this.superficial = (this.total - this.aggravated);
        } 
        else 
        {
            // will not go over does not matter if it goes under.
            this.superficial += amount;
            if (this.superficial < 0) this.superficial = 0;
        }
    }

    setSuperfical(amount)
    {
        if (amount > (this.total - this.aggravated))
        {
            this.superficial = (this.total - this.aggravated);
        }
        else if (amount < 0)
        {
            // Should never be less then 0
            return;
        }
        else
        {
            this.superficial = amount;
        }
    }

    takeAgg(amount)
    {
        if (amount > (this.total - this.aggravated - this.superficial)) 
        {
            // taking more agg damage then undamaged available
            // convert superficial damage to agg for exess
            this.superficial -= (amount - 
                (this.total - this.aggravated - this.superficial));
            if (this.superficial < 0) this.superficial = 0;
            this.aggravated = (this.total - this.superficial);
        } 
        else 
        {
            // will not go over does not matter if it goes under.
            this.aggravated += amount;
            if (this.aggravated < 0) this.aggravated = 0;
        }
    }

    setAgg(amount)
    {
        if (amount > this.total)
        {
            this.aggravated = this.total;
        }
        else if (amount < 0)
        {
            // Should never be less then 0
            return;
        }
        else
        {
            this.aggravated = amount;
        }
    }

    setTotal(amount)
    {
        if (amount < 1) return; // Should never be less than 1 
        this.total = amount;
        this.adjustSecondaryValues();
    }

    updateCurrent(amount)
    {
        this.total += amount;
        if (this.total < 1) this.total = 1;
        else if (this.total > 20) this.total = 20;
        this.adjustSecondaryValues();
    }

    adjustSecondaryValues()
    {
        if (this.total < (this.aggravated + this.superficial)) 
        {
            this.superficial = (this.total - this.aggravated);
            if (this.superficial < 0) this.superficial = 0;
            if (this.total < this.aggravated) this.aggravated = this.total;
        }
    }

    toSerializable()
    {
        return {total: this.total, superficial: this.superficial,
            aggravated: this.aggravated};
    }
}