'use strict';
const { Roll } = require("../modules/dice");

module.exports = class initiativeCharacter
{
  constructor({name, member, json=null}={})
  {
    this.memberId = member?.id ?? null;
    this.memberName = member?.displayName ?? null;
    this.name = name ?? null;
    
    this.joinedRound = false;
    this.rolled = false;    
    this.dexWits = 0;
    this.d10 = 0;
    this.modifier = 0;
    this.initiative = 0;
    this.extraActions = 0;
    
    this.declared = false;
    this.action = null;

    if (json) this.deserialize(json);
  }

  setinitiative(initiative)
  {
    if (typeof initiative != "number") throw new TypeError();
    this.initiative = initiative;        
    if (this.initiative < 0) this.initiative = 0;
    else if (this.initiative > 200) this.initiative = 200;
    return this;
  }

  rollInitiative(dexWits=0, modifier=0, extraActions=0)
  {
    this.dexWits = dexWits;
    this.modifier = modifier;
    this.extraActions = extraActions;
    this.rolled = true;
    this.joinedRound = true;

    const totalPool = (this.pool + this.mod);
    this.d10 = Roll.single(10);
    this.initiative = (this.d10 + totalPool);
    if (this.initiative < 0) this.initiative = 0;
    return this.initiative;
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

  serialize()
  {

  }

  deserialize(json)
  {

  }
}