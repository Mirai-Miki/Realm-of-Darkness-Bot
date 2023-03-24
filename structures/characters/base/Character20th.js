'use strict';
const Character = require("./Character.js");
const { Consumable, DamageTracker20th } = require("../../../structures");

module.exports = class Character20th extends Character
{
  constructor({name, willpower=2, user, guild}={})
  {
    super({name: name, user: user, guild: guild});
    this.version = '20th';
    this.willpower = new Consumable(willpower);
    this.health = new DamageTracker20th();
  }

  setFields(args)
  {
    super.setFields(args);
    if (args.willpower != null) char.willpower.setTotal(args.willpower);
    if (args.health != null) char.health.setTotal(args.health);
    if (args.bashing != null) char.health.setBashing(args.bashing);
    if (args.lethal != null) char.health.setLethal(args.lethal);
    if (args.agg != null) char.health.setAgg(args.agg);
  }
  
  updateFields(args)
  {
    super.updateFields(args);
    if (args.willpower != null) char.willpower.updateCurrent(args.willpower);  
    if (args.health != null) char.health.updateCurrent(args.health);
    if (args.bashing != null) char.health.updateBashing(args.bashing);
    if (args.lethal != null) char.health.updateLethal(args.lethal);
    if (args.agg != null) char.health.updateAgg(args.agg);
  }

  deserilize(json)
  {
    super.deserilize(json);
    this.willpower.setTotal(json.willpower.total);
    this.willpower.setCurrent(json.willpower.current);
    if (json.health.total) this.health.setTotal(json.health.total);
    this.health.setBashing(json.health.bashing);
    this.health.setLethal(json.health.lethal);
    this.health.setAgg(json.health.aggravated);
    return this;
  }

  serialize()
  {
    const s = super.serialize();
    s.character['version'] = this.version;
    s.character['willpower'] = {
        total: this.willpower.total,
        current: this.willpower.current,
    };
    s.character['health'] = {
        total: this.health.total,
        bashing: this.health.bashing,
        lethal: this.health.lethal,
        aggravated: this.health.aggravated,
    };
    return s
  }
}