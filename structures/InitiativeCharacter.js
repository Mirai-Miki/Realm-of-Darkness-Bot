'use strict';
const { Roll } = require("../modules/dice");

module.exports = class initiativeCharacter
{
  constructor({name, memberId, json=null}={})
  {
    this.memberId = memberId ?? null;
    this.name = name ?? null;
    
    this.joinedRound = false;
    this.rolled = false;    
    this.dexWits = 0;
    this.d10 = 0;
    this.modifier = 0;
    this.initiative = 0;
    this.extraActions = 0;

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

  newRound()
  {
    this.joinedRound = false;
    this.rolled = false;
    this.extraActions = 0;
  }

  serialize()
  {
    return {
      member_id: this.memberId,
      name: this.name,
      joined_round: this.joinedRound,
      dex_wits: this.dexWits,
      d10: this.d10,
      modifier: this.modifier,
      initiative: this.initiative,
      extraActions: this.extraActions
    }
  }

  deserialize(json)
  {
    this.memberId = json.member_id;
    this.name = json.name;
    this.joinedRound = json.joined_round;
    this.dexWits = json.dex_wits;
    this.d10 = json.d10;
    this.modifier = json.modifier;
    this.initiative = json.initiative;
    this.extraActions = json.extraActions;
  }
}