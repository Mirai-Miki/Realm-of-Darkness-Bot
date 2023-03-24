'use strict';

module.exports.Emoji = require('./emoji');
module.exports.Splats = require('./Splats');
module.exports.ComponentCID = require('./ComponentCID');

module.exports.Supporter = 
{
  fledgling: 1,
  neonate: 2,
  ancilla: 3,
  elder: 4,
  methuselah: 5
}

module.exports.InitPhase =
{
  NEW: 0,
  ROLL: 1,
  REVEAL: 2,
  DECLARE: 3,
  DECLARED: 4,
  JOIN: 5,
  END: 6
}