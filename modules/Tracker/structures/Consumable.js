'use strict';
module.exports = class Consumable
{
    constructor(total, current=total)
    {
        this.total = total;
        this.current = current;
        this.modified = 0;
        this.overflow = 0;

        if (this.current > this.total)
        {
            this.overflow = this.current - this.total;
            this.current = this.total;
        }
    }

    updateCurrent(amount)
    {
        this.overflow = 0;
        const before = 0;
        this.current += amount;

        if (this.current < 0) 
        {
            this.current = 0;
        }
        else if (this.current > this.total)
        {
            this.overflow = this.current - this.total;
            this.current = this.total;
        }
        this.modified += this.current - before;
    }

    setCurrent(amount)
    {
        this.overflow = 0;
        const before = this.current;
        this.current = amount;

        if (this.current < 0) 
        {
            this.current = 0;
        }
        else if (this.current > this.total)
        {
            this.current = this.total;
        }
        this.modified += this.current - before;
    }

    setTotal(amount)
    {
        this.overflow = 0;
        const before = this.total;
        let offset = amount - this.total;
        if (offset < 0) offset = 0;
        this.total = amount;
        this.updateCurrent(offset);
        if (this.current > this.total) this.current = this.total;
        this.modified += this.total - before;
    }

    incTotal(amount)
    {
        this.overflow = 0;
        this.total += amount;
        if (amount > 0) this.updateCurrent(amount);
        if (this.current > this.total) this.current = this.total;
    }
}