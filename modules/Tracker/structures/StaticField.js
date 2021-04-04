module.exports = class StaticField
{
    constructor(current, min, max)
    {
        this.min = min;
        this.max = max;
        this.current = current;
        this.overflow = 0;
        if (this.current > max) this.current = max;
        if (this.current < min) this.current = min;     
    }

    modifiyCurrent(amount)
    {
        if (amount === 0) this.current = 0;
        this.resetOverflow();
        this.current += amount;

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
        this.resetOverflow();
        this.current = amount;

        if (this.current < this.min) 
        {
            this.current = this.min;
        }
        else if (this.current > this.max)
        {
            this.current = this.max;
        }
    }    

    resetOverflow()
    {
        this.overflow = 0;
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