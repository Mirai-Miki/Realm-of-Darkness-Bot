module.exports = class Consumable
{
    constructor(total, current=total)
    {
        this.total = total;
        this.current = current;
        this.overflow = 0;

        if (this.current > this.total)
        {
            this.overflow = this.current - this.total;
            this.current = this.total;
        }
    }

    modifiyCurrent(amount)
    {
        if (amount === 0) this.current = 0;
        this.resetOverflow();
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
    }

    resetOverflow()
    {
        this.overflow = 0;
    }

    setCurrent(amount)
    {
        this.resetOverflow();
        this.current = amount;

        if (this.current < 0) 
        {
            this.current = 0;
        }
        else if (this.current > this.total)
        {
            this.current = this.total;
        }
    }

    setTotal(amount)
    {
        this.resetOverflow();
        this.total = amount;
        if (this.current > this.total) this.current = this.total;
    }

    updateTotal(amount)
    {
        this.resetOverflow();
        let offset = amount - this.total;
        if (offset < 0) offset = 0;
        this.total = amount;
        if (offset > 0) this.modifiyCurrent(offset);
        if (this.current > this.total) this.current = this.total;
    }

    incTotal(amount)
    {
        this.resetOverflow();
        this.total += amount;
        if (amount > 0) this.modifiyCurrent(amount);
        if (this.current > this.total) this.current = this.total;
    }
}