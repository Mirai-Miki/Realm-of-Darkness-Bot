'use strict';
module.exports = class StaticField
{
    constructor(current, min, max)
    {
        this.min = min;
        this.max = max;
        this.current = current;
        this.overflow = 0;
        this.modified = 0;
        if (this.current > max) this.current = max;
        if (this.current < min) this.current = min;     
    }

    updateCurrent(amount)
    {
        this.overflow = 0;
        const before = this.current;
        this.current += amount;
        this.modified += this.current - before;

        if (this.current < this.min) 
        {
            this.overflow = this.current - this.min;
            this.current = this.min;
            
        }
        else if (this.current > this.max)
        {
            this.overflow = this.current - this.max;
            this.current = this.max;
        }
    }

    setCurrent(amount)
    {
        this.overflow = 0;
        const before = this.current;
        this.current = amount;
        this.modified += this.current - before;       

        if (this.current < this.min) 
        {
            this.current = this.min;
        }
        else if (this.current > this.max)
        {
            this.current = this.max;
        }
    }

    setMin(amount)
    {
        this.min = amount;
    }

    setMax(amount)
    {
        this.max = amount;
    }
}