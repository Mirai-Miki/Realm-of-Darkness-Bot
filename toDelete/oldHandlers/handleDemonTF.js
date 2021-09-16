'use strict';

const mode = require('../TypeDef/mode.js');
const errorType = require('../TypeDef/errors.js');
const Demon = require('../characters/DemonTF.js');
const { serializeCharacter } = require('../util/serilizeCharacter.js');
const { setOwnerInfo } = require('../util/setOwnerInfo.js');
// Key handling
const CharacterKeys = require('../keys/CharacterKeys.js');
const Character20thKeys = require('../keys/Character20thKeys.js');
const DemonTFKeys = require('../keys/DemonTFKeys.js');
const { sortKeys } = require('../keys/SortKeys.js');
// Create Embed
const { character20thEmbed } = require('../embed/character20thEmbed.js');

module.exports =
{
    name: 'Demon The Fallen',
    version: 'v20',
    splat: 'Demon',
    keyHelp: 'demonTF',    

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
        return {...Character20thKeys, ...DemonTFKeys, ...CharacterKeys};
    }
}

/////////////////////////// Private Helper Functions ///////////////////////////

function newCharacter(tracker, keys)
{
    if (tracker.error) return;
    newKeyCheck(tracker, keys);
    if (tracker.error) return;

    let char = new Demon();
    
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
    else if (!keys.permTorment)
    {
        tracker.error = errorType.missingPermTorment;
    }

    return;
}

function updateCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Demon();
    char.deserilize(tracker.character);
    char = updateFields(keys, char);
    char.updateHistory(keys, tracker.notes, "Update");
    
    return char;
}

function setCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Demon();
    char.deserilize(tracker.character);    
    char.updateHistory(keys, tracker.notes, "Set");
    char = setFields(keys, char);
    if (keys.exp != undefined) char.exp.incTotal(keys.exp);
    return char;
}

function findCharacter(tracker)
{
    let char = new Demon();
    char.deserilize(tracker.character);
    return char;
}

function setFields(keys, char)
{
    char.resetOverflows();
    char.setUpdateDate();   
    
    if (keys.willpower != undefined) 
        char.willpower.updateTotal(keys.willpower);
    
    if (keys.faith != undefined) char.faith.setTotal(keys.faith);
    if (keys.permTorment != undefined) 
        char.permTorment.setCurrent(keys.permTorment);
    if (keys.tempTorment != undefined) 
        char.tempTorment.setCurrent(keys.tempTorment);

    if (keys.health != undefined) char.health.setTotal(keys.health);
    if (keys.bashing != undefined) char.health.setBashing(keys.bashing);
    if (keys.lethal != undefined) char.health.setLethal(keys.lethal);
    if (keys.aggravated != undefined) char.health.setAgg(keys.aggravated);
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

    if (keys.willpower != undefined) 
        char.willpower.modifiyCurrent(keys.willpower);
    if (keys.faith != undefined) 
        char.faith.modifiyCurrent(keys.faith);

    if (keys.permTorment != undefined) 
        char.permTorment.modifiyCurrent(keys.permTorment);
    if (keys.tempTorment != undefined) 
        char.tempTorment.modifiyCurrent(keys.tempTorment);
    
    if (char.tempTorment.overflow > 0)
    {
        char.permTorment.modifiyCurrent(1);
        char.tempTorment.setCurrent(0 + (char.tempTorment.overflow - 1));
    }

    if (keys.exp > 0) char.exp.modifiyCurrent(keys.exp);
    else if (keys.exp != undefined) char.exp.modifiyCurrent(keys.exp);
    return char;
}