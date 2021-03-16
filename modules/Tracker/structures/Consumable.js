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

    addTotal(amount)
    {
        this.resetOverflow();
        this.total += amount;
    }

    removeTotal(amount)
    {
        this.resetOverflow();
        this.total -= amount;
    }

    setTotal(amount)
    {
        this.resetOverflow();
        this.total = amount;
    }

    print()
    {
        // Might get rid of this
    }

    toSerializable()
    {
        return {total: this.total, current: this.current};
    }
}