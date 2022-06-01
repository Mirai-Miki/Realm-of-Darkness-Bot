'use strict';
const Roll = require("../dice/Roll");

module.exports.InitCharacter = class InitCharacter
{
    constructor(character)
    {
        this.memberId = character?.memberId ?? "";
        this.member;
        this.name = character?.name ?? "";
        this.rolled = character?.rolled ?? false;
        this.pool = character?.pool ?? 0;
        this.mod = character.mod ?? 0;
        this.init = character?.init ?? 0;
        this.declared = character?.declared ?? false;
        this.action = character?.action ?? "";
    }

    /**
     * Sets the name of the Character
     * @param {string} name The name 
     */
    setName(name)
    {
        if (typeof name != "string") throw new TypeError();
        this.name = name;
        return this;
    }

    setRolled(rolled)
    {
        if (typeof rolled != "boolean") throw new TypeError();
        this.rolled = rolled;
        return this;
    }

    setPool(dexWits)
    {
        if (typeof dexWits != "number") throw new TypeError();
        this.pool = dexWits;
        if (this.pool < 0) this.pool = 0;
        else if (this.pool > 100) this.pool = 100;
        return this;
    }

    setMod(modifier)
    {
        if (typeof modifier != "number") throw new TypeError();
        this.mod = modifier;
        if (this.mod < 0) this.mod = 0;
        else if (this.mod > 100) this.mod = 100;
        return this;
    }

    setInit(init)
    {
        if (typeof init != "number") throw new TypeError();
        this.init = init;        
        if (this.init < 0) this.init = 0;
        else if (this.init > 200) this.init = 200;
        return this;
    }

    rollInit()
    {
        this.init = (Roll.single(10) + this.pool + this.mod);
        return this.init;
    }

    declareAction(action)
    {
        if (typeof action != "string") throw new TypeError();
        this.action = action;
        if (this.action.length > 100) throw new StringParseError();
        return this;
    }

    setDeclared(declared)
    {
        if (typeof declared != "boolean") throw new TypeError();
        this.declared = declared;        
        return this;
    }
}

class StringParseError extends Error
{
    constructor() 
    {
        super("String exceeds max value!");
        this.name = "StringParseError";
    }
}