'use strict';
module.exports = class Counter
{
    constructor(permanant=5, temporary=0, max=10)
    {
        this.permanant = permanant;
        this.temporary = temporary;
        this.max = max;
    }

    updatePermanant(amount)
    {
        this.permanant += amount;
        if (this.permanant > this.max) this.permanant = this.max;
        else if (this.permanant < 0) this.permanant = 0;
    }

    setPermanant(amount)
    {
        if (amount > this.max) amount = this.max;
        else if (amount < 0) amount = 0;
        this.permanant = amount;
    }

    updateTemporary(amount)
    {
        this.temporary += amount;

        if (this.temporary < 0) 
        {
            this.temporary = 0;
        }
        else if (this.temporary > (this.max - 1))
        {            
            let offset = this.temporary - this.max;
            while (true)
            {
                this.permanant++;
                if (offset - this.max < 0) break;                
                offset -=this.max;
            }

            this.temporary = offset;
            if (this.permanant > this.max) this.permanant = this.max;            
        }
    }

    setTemporary(amount)
    {
        if (amount >= this.max) amount = this.max - 1;
        else if (amount < 0) amount = 0;
        this.temporary = amount;
    }
}