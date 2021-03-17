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
        if (amount === 0)
        {
            this.superficial = 0;
        }
        else if (amount > (this.total - this.aggravated - this.superficial)) 
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

    takeAgg(amount)
    {
        if (amount === 0)
        {
            this.aggravated = 0;
        }
        else if (amount > (this.total - this.aggravated - this.superficial)) 
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

    setTotal(amount)
    {
        this.total = amount;
        
        if (this.total < (this.aggravated + this.superficial)) 
        {
            // taking more superficial damage then is available
            // take agg damage as well.
            this.aggravated += ((this.aggravated + this.superficial) - 
                this.total);
            this.superficial = (this.total - this.aggravated);

            if (this.superficial < 0) this.superficial = 0;
            if (this.aggravated > this.total) this.aggravated = this.total;
        }
    }

    print()
    {
        
    }

    toSerializable()
    {
        return {total: this.total, superficial: this.superficial,
            aggravated: this.aggravated};
    }
}