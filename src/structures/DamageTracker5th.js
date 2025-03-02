"use strict";
require(`${process.cwd()}/alias`);
const { Emoji } = require("@constants");

module.exports = class DamageTracker5th {
  constructor(total, superficial = 0, aggravated = 0) {
    this.total = total;
    this.superficial = superficial;
    this.aggravated = aggravated;
  }

  takeSuperfical(amount) {
    if (amount > this.total - this.aggravated - this.superficial) {
      // taking more superficial damage then is available
      // take agg damage as well.
      this.aggravated +=
        amount - (this.total - this.aggravated - this.superficial);

      if (this.aggravated > this.total) this.aggravated = this.total;
      this.superficial = this.total - this.aggravated;
    } else {
      // will not go over does not matter if it goes under.
      this.superficial += amount;
      if (this.superficial < 0) this.superficial = 0;
    }
  }

  setSuperfical(amount) {
    if (amount > this.total - this.aggravated) {
      this.superficial = this.total - this.aggravated;
    } else if (amount < 0) {
      // Should never be less then 0
      return;
    } else {
      this.superficial = amount;
    }
  }

  takeAgg(amount) {
    if (amount > this.total - this.aggravated - this.superficial) {
      // taking more agg damage then undamaged available
      // convert superficial damage to agg for exess
      this.superficial -=
        amount - (this.total - this.aggravated - this.superficial);
      if (this.superficial < 0) this.superficial = 0;
      this.aggravated = this.total - this.superficial;
    } else {
      // will not go over does not matter if it goes under.
      this.aggravated += amount;
      if (this.aggravated < 0) this.aggravated = 0;
    }
  }

  setAgg(amount) {
    if (amount > this.total) {
      this.aggravated = this.total;
    } else if (amount < 0) {
      // Should never be less then 0
      return;
    } else {
      this.aggravated = amount;
    }
  }

  setTotal(amount) {
    if (amount < 1) return; // Should never be less than 1
    this.total = amount;
    this._adjustSecondaryValues();
  }

  updateCurrent(amount) {
    this.total += amount;
    if (this.total < 1) this.total = 1;
    else if (this.total > 20) this.total = 20;
    this._adjustSecondaryValues();
  }

  _adjustSecondaryValues() {
    // If total is less than the sum of aggravated and superficial
    if (this.total < this.aggravated + this.superficial) {
      // Calculate the excess amount
      let excess = this.aggravated + this.superficial - this.total;

      this.superficial -= excess * 2;
      if (this.superficial < 0) this.superficial = 0;
      this.aggravated += excess;
      if (this.aggravated > this.total) this.aggravated = this.total;
    }
  }

  getHealthStatus(type) {
    if (this.total - this.aggravated <= 0 && type === "health")
      return conditionInfo.dead;
    else if (this.total - this.aggravated <= 0 && type === "willpower")
      return conditionInfo.breakdown;
    else if (this.total - this.superficial - this.aggravated <= 0)
      return conditionInfo.impaired;
    else return "";
  }

  getUndamaged() {
    return this.total - this.superficial - this.aggravated;
  }

  getTracker() {
    let tracker = "";
    let aggDamage = this.aggravated;
    let supDamage = this.superficial;
    for (let i = 0; i < this.total; i++) {
      if (i == 5 || i == 10 || i == 15) tracker += "⠀";

      if (aggDamage > 0) {
        tracker += Emoji.redBox;
        aggDamage--;
      } else if (supDamage > 0) {
        tracker += Emoji.yellowBox;
        supDamage--;
      } else tracker += Emoji.greenBox;
    }
    tracker += "⠀";
    return tracker;
  }

  serialize() {
    return {
      total: this.total,
      superficial: this.superficial,
      aggravated: this.aggravated,
    };
  }
};

const conditionInfo = {
  impaired: "You are currently Impaired.",
  dead: "You have entered Torpor or are Dead.",
  breakdown: "You have mentally broken down.",
};
