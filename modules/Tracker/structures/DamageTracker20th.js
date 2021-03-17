const MAX = 7;

module.exports = class DamageTracker20th
{
    constructor()
    {
        this.bashing = 0;
        this.lethal = 0;
        this.aggravated = 0;
    }

    takeBashing(amount)
    {

    }

    takeLethal(amount)
    {

    }

    takeAgg(amount)
    {

    }

    healBashing(amount)
    {

    }

    healLethal(amount)
    {

    }

    healAgg(amount)
    {

    }

    setBashing(amoung)
    {

    }

    setLethal(amount)
    {

    }

    setAgg(amount)
    {
        
    }

    print()
    {
        
    }

    toSerializable()
    {
        return {bashing: this.bashing, lethal: this.lethal, 
            aggravated: this.aggravated};
    }
}