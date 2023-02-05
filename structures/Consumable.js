'use strict';
const { Emoji } = require('../Constants');

module.exports = class Consumable
{
  /**
   * 
   * @param {Number} total The total the consumable can reach normally
   * @param {Number} current The current value of the consumable
   * @param {Number} min The minumum the current value can drop too.
   */
  constructor(total, current=total, min=0)
  {
      this.total = total;
      this.current = current;
      // The minimum amount the current pool can drop too. Not the total.
      this.min = min;
      this.modified = 0;
      this.overflow = 0;
      // If unlocked a current is not limited by the total.
      this.locked = true;
      this.maxCurrent; // If unlocked the max current can reach.
      if (this.current > this.total)
      {
          this.overflow = this.current - this.total;
          this.current = this.total;
      }
  }

  unlock(max)
  {
      this.locked = false;
      this.maxCurrent = max;
  }

  updateCurrent(amount)
  {
    this.overflow = 0;
    const before = 0;
    this.current += amount;

    if (this.current < this.min) 
    {
      this.current = this.min;
    }
    else if (this.current > this.total)
    {
      if (this.locked)
      {
        this.overflow = this.current - this.total;
        this.current = this.total;
      }
      else if (this.current > this.maxCurrent) 
      {
        this.overflow = this.current - this.maxCurrent;
        this.current = this.maxCurrent;
      }            
    }
    this.modified += this.current - before;
  }

  setCurrent(amount)
  {
    this.overflow = 0;
    const before = this.current;
    this.current = amount;

    if (this.current < this.min) 
    {
      this.current = this.min;
    }
    else if (this.current > this.total)
    {
      if (this.locked)
      {
          this.current = this.total
      }
      else if (this.current > this.maxCurrent)
      {
          this.current = this.maxCurrent;
      }
    }
    this.modified += this.current - before;
  }

  setTotal(amount, inc=true)
  {
    this.overflow = 0;
    const before = this.total;
    let offset = amount - this.total;
    if (offset < 0) offset = 0;
    this.total = amount;
    if (inc) this.updateCurrent(offset);
    if (this.current > this.total) this.current = this.total;
    this.modified += this.total - before;
  }

  incTotal(amount)
  {
    this.overflow = 0;
    this.total += amount;
    if (amount > 0) this.updateCurrent(amount);
    if (this.current > this.total) this.current = this.total;
  }

  getTracker({showEmoji=true, emoji=Emoji.red_dot}={})
  {
    let tracker = "";

    if (this.total > 15 || !showEmoji)
    {
      tracker = `\`\`\`q\n[${this.current}/${this.total}]\n\`\`\``
      return tracker;
    }

    for (let i = 0; i < this.total; i++) 
    {
      if (i < this.current) tracker += emoji
      else tracker += Emoji.blank_dot;                
    }
    tracker += '⠀';
    return tracker;
  }
}