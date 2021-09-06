'use strict';

const mode = require('../TypeDef/mode.js');
const errorType = require('../TypeDef/errors.js');
const Changeling = require('../characters/Changeling20th.js');
const { serializeCharacter } = require('../util/serilizeCharacter.js');
const { setOwnerInfo } = require('../util/setOwnerInfo.js');
// Key handling
const CharacterKeys = require('../keys/CharacterKeys.js');
const Character20thKeys = require('../keys/Character20thKeys.js');
const Changeling20thKeys = require('../keys/changeling20thKeys.js');
const { sortKeys } = require('../keys/SortKeys.js');
// Create Embed
const { character20thEmbed } = require('../embed/character20thEmbed.js');

module.exports =
{
    name: 'Changeling 20th Edition',
    version: 'v20',
    splat: 'Changeling',
    keyHelp: 'changeling20th',    

    handle(tracker)
    {
        let character;
        let keys;
        let unknownKeys;
        
        if (!tracker.error) [ keys, unknownKeys ] = sortKeys(tracker, this);

        switch (tracker.mode)
        {
            case mode.new:
                character = newCharacter(tracker, keys)
                break;
            case mode.update:
                character = updateCharacter(tracker, keys)
                break;
            case mode.set:
                character = setCharacter(tracker, keys)
                break;
            case mode.find:
                character = findCharacter(tracker)
                break;
            default:
                console.error("Hit default case in handler");
                return 'Handler Error: Default Case';
        }
        if (!tracker.error)
        {
            setOwnerInfo(tracker.recvMess, character);
            serializeCharacter(character);
        }
        return character20thEmbed(character, tracker, unknownKeys);
    },

    getKeys()
    {
        return {...Character20thKeys, ...Changeling20thKeys, ...CharacterKeys};
    }
}

/////////////////////////// Private Helper Functions ///////////////////////////

function newCharacter(tracker, keys)
{
    if (tracker.error) return;
    newKeyCheck(tracker, keys);
    if (tracker.error) return;

    let char = new Changeling();
    
    char.setName(tracker.name);
    char.setOwner(tracker.recvMess);
    char.setGuild(tracker.guild);
    char.updateHistory(keys, tracker.notes, "New");
    char = setFields(keys, char);
    if (keys.exp != undefined) char.exp.updateTotal(keys.exp);
    return char;
}

function newKeyCheck(tracker, keys)
{
    if (!keys.willpower)
    {
        tracker.error = errorType.missingWillpower;
    }
    return;
}

function updateCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Changeling();
    char.deserilize(tracker.character);
    char = updateFields(keys, char);
    char.updateHistory(keys, tracker.notes, "Update");   
    return char;
}

function setCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Changeling();
    char.deserilize(tracker.character);
    char.updateHistory(keys, tracker.notes, "Set");
    char = setFields(keys, char);
    if (keys.exp != undefined) char.exp.incTotal(keys.exp);
    return char;
}

function findCharacter(tracker)
{
    let char = new Changeling();
    char.deserilize(tracker.character);
    return char;
}

function setFields(keys, char)
{
    char.resetOverflows();
    char.setUpdateDate();

    if (keys.willpower != undefined) 
    char.willpower.updateTotal(keys.willpower);
    if (keys.glamour != undefined) char.glamour.updateTotal(keys.glamour);
    if (keys.banality != undefined) char.banality.updateTotal(keys.banality);
    if (keys.nightmare != undefined) char.nightmare.setCurrent(keys.nightmare);
    if (keys.imbalance != undefined) char.imbalence.setCurrent(keys.imbalance);

    if (keys.health != undefined) char.health.setTotal(keys.health);
    if (keys.bashing != undefined) char.health.setBashing(keys.bashing);
    if (keys.lethal != undefined) char.health.setLethal(keys.lethal);
    if (keys.aggravated != undefined) char.health.setAgg(keys.aggravated);
    
    if (keys.chimBashing != undefined) 
        char.chimericalHealth.setBashing(keys.chimBashing);
    if (keys.chimLethal != undefined) 
        char.chimericalHealth.setLethal(keys.chimLethal);
    if (keys.chimAggravated != undefined) 
        char.chimericalHealth.setAgg(keys.chimAggravated);
    return char;
}

function updateFields(keys, char)
{
    char.resetOverflows();
    char.setUpdateDate();

    if (keys.health != undefined) char.health.updateTotal(keys.health);
    if (keys.bashing != undefined) char.health.updateBashing(keys.bashing);
    if (keys.lethal != undefined) char.health.updateLethal(keys.lethal);
    if (keys.aggravated != undefined) char.health.updateAgg(keys.aggravated);
    
    if (keys.chimBashing != undefined) 
        char.chimericalHealth.updateBashing(keys.chimBashing);
    if (keys.chimLethal != undefined) 
        char.chimericalHealth.updateLethal(keys.chimLethal);
    if (keys.chimAggravated != undefined) 
        char.chimericalHealth.updateAgg(keys.chimAggravated);

    if (keys.willpower != undefined) 
        char.willpower.modifiyCurrent(keys.willpower);
    if (keys.exp > 0) char.exp.modifiyCurrent(keys.exp);
    else if (keys.exp != undefined) char.exp.modifiyCurrent(keys.exp);
    if (keys.glamour != undefined) char.glamour.modifiyCurrent(keys.glamour);
    if (keys.banality != undefined) char.banality.modifiyCurrent(keys.banality);
    if (keys.nightmare != undefined) 
        char.nightmare.modifiyCurrent(keys.nightmare);
    if (keys.imbalance != undefined) 
        char.imbalence.modifiyCurrent(keys.imbalance);

    return char;
}