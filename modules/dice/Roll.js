'use strict';
const crypto = require('crypto');

module.exports.single = function(diceSides)
{
  return crypto.randomInt(1, diceSides + 1);
  //return Math.floor(Math.random() * diceSides) + 1;
},

module.exports.manySingle = function(quantity, diceSides)
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

module.exports.d10 = function(quantitiy)
{
  const results = [];
  for (let i = 0; i < quantitiy; i++) results.push(this.single(10));
  return results;
}