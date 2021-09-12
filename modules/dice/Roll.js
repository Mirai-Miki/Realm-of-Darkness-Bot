'use strict';

module.exports = class Roll
{
    static v5hunger = 'v5h';
    static v5black = 'v5b';

    static manyTypes(diceQueue)
    {
        let results = [];

        Object.entries(diceQueue).forEach((entry) =>
        {
            const [key, value] = entry;
            
            for (let i = 0; i < value; i++)
            {
                let result = Roll.single(key);
                let diceResult = {diceType: `d${key}`, 'result': result};
                results.push(diceResult);
            }
            console.log("Not finished");
        });
        console.log("finished");
        return results;
    }

    static v5(pool, hunger)
    {
        let regularQueue = pool - hunger;
        if (hunger > pool) hunger = pool;
        let results = [];

        for (let i = 0; i < regularQueue; i++)
        {
            let result = Roll.single(10);
            let diceResult = {type: this.v5black, 'result': result};
            results.push(diceResult);
        }

        for (let i = 0; i < hunger; i++)
        {
            let result = Roll.single(10);
            let diceResult = {type: this.v5hunger, 'result': result};
            results.push(diceResult);
        }

        return results
    }

    static single(diceSides)
    {
        return Math.floor(Math.random() * diceSides) + 1;
    }

    static manySingle(quantity, diceSides)
    {
        let sides = diceSides.toString();
        let results = {total: 0};
        results[sides] = [];

        for (let i = 0; i < quantity; i++)
        {
            let result = Roll.single(diceSides);
            results[sides].push(result);
            results.total += result;
        }

        return results;
    }
}