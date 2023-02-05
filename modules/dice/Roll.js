'use strict';

module.exports = 
{
    single(diceSides)
    {
        return Math.floor(Math.random() * diceSides) + 1;
    },

    manySingle(quantity, diceSides)
    {
        let sides = diceSides.toString();
        let results = {total: 0};
        results[sides] = [];

        for (let i = 0; i < quantity; i++)
        {
            let result = this.single(diceSides);
            results[sides].push(result);
            results.total += result;
        }

        return results;
    },

    d10(quantitiy)
    {
        const results = [];
        for (let i = 0; i < quantitiy; i++)
        {
            results.push(this.single(10));
        }
        return results;
    }
}