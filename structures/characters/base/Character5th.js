'use strict';
const DamageTracker5th = require("../../DamageTracker5th");
const Character = require("./Character.js");

module.exports = class Character5th extends Character
{
constructor({name, health=4, willpower=2, user, guild}={}) 
  {
    super({name: name, user: user, guild: guild});
    this.version = '5th';
    this.willpower = new DamageTracker5th(willpower);
    this.health = new DamageTracker5th(health);
  }

  setFields(args)
  {
    super.setFields(args);
    if (args.willpower != null) this.willpower.setTotal(args.willpower);
    if (args.health != null) this.health.setTotal(args.health);
    if (args.willpowerSup != null) this.willpower.setSuperfical(args.willpowerSup);
    if (args.willpowerAgg != null) this.willpower.setAgg(args.willpowerAgg);
    if (args.healthSup != null) this.health.setSuperfical(args.healthSup);
    if (args.healthAgg != null) this.health.setAgg(args.healthAgg);
  }

  updateFields(args)
  {
    super.updateFields(args);
    if (args.willpower != null) this.willpower.updateCurrent(args.willpower);  
    if (args.health != null) this.health.updateCurrent(args.health);
    if (args.willpowerSup != null) this.willpower.takeSuperfical(args.willpowerSup);
    if (args.willpowerAgg != null) this.willpower.takeAgg(args.willpowerAgg);
    if (args.healthSup != null) this.health.takeSuperfical(args.healthSup);
    if (args.healthAgg != null) this.health.takeAgg(args.healthAgg);
  }

  deserilize(json)
  {
    super.deserilize(json);
      
    this.willpower.setTotal(json.willpower.total);
    this.willpower.takeSuperfical(json.willpower.superficial);
    this.willpower.takeAgg(json.willpower.aggravated);
    this.health.setTotal(json.health.total);
    this.health.takeSuperfical(json.health.superficial);
    this.health.takeAgg(json.health.aggravated);
    return this;
  }

  serialize()
  {
    const s = super.serialize();
    s.character['version'] = this.version;
    s.character['willpower'] = {
      total: this.willpower.total,
      superficial: this.willpower.superficial,
      aggravated: this.willpower.aggravated,
    };
    s.character['health'] = {
      total: this.health.total,
      superficial: this.health.superficial,
      aggravated: this.health.aggravated,
    };
    return s
  }
}