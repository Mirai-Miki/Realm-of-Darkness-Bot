const Character20th = require("./Character20th");

module.exports = class Changeling20 extends Character20th
{
    constructor() 
    {
        super();
        this.glamour;
        this.banality;

        this.healthChim = 0;
        this.bashingChim = 0;
        this.lethalChim = 0;
        this.aggravatedChim = 0;
    }
}