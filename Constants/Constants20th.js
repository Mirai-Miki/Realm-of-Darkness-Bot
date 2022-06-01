'use strict'
/*
 * Constants for the 20th edition bot
 */

/**
 * Component Custom Identifiers
 */
module.exports.ComponentCID =
{
    INIT_NEXT_ROUND: "InitNextRound",
    INIT_END: "InitEnd",
    INIT_REVEAL: "InitReveal",
    INIT_DECLARE: "InitDeclare",
    INIT_CONFIRM: "InitConfirm"
}

/**
 * Phases an Initiative tracker can be in
 */
module.exports.InitPhase = 
{
    NEW: 0,
    ROLL: 1,
    REVEAL: 2,
    DECLARE: 3,
    DECLARED: 4,
    END: 5
}
