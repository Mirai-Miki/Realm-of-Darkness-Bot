const mode = require('../TypeDef/mode.js');
const errorType = require('../TypeDef/errors.js');
const Mortal = require('../characters/Mortal5th.js');
const { serializeCharacter } = require('../util/serilizeCharacter.js');
// Key handling
const CharacterKeys = require('../keys/CharacterKeys.js');
const Character5thKeys = require('../keys/Character5thKeys.js');
const Mortal5thKeys = require('../keys/mortal5thKeys.js');
const { sortKeys } = require('../keys/SortKeys.js');
// Create Embed
const { character5thEmbed } = require('../embed/character5thEmbed.js');

module.exports =
{
    name: 'Mortal 5th Edition',
    version: 'v5',
    splat: 'Mortal',
    keyHelp: 'mortal5th',    

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
        if (!tracker.error) serializeCharacter(character);
        return character5thEmbed(character, tracker, unknownKeys);
    },

    getKeys()
    {
        return {...Character5thKeys, ...Mortal5thKeys, ...CharacterKeys};
    }
}

/////////////////////////// Private Helper Functions ///////////////////////////

function newCharacter(tracker, keys)
{
    if (tracker.error) return;
    newKeyCheck(tracker, keys);
    if (tracker.error) return;

    if (keys.hunger != undefined) keys.hunger -= 1;
    let char = new Mortal(keys.health, keys.willpower, 
        keys.humanity);
    
    char.setName(tracker.name);
    char.setOwner(tracker.recvMess.author.id);
    char.setGuild(tracker.guild);
    char = modifyCharacter(keys, char);
    if (keys.exp != undefined) char.exp.updateTotal(keys.exp);
    return char;
}

function newKeyCheck(tracker, keys)
{
    if (!keys.humanity)
    {
        tracker.error = errorType.missingHumanity;
    }

    else if (!keys.health)
    {
        tracker.error = errorType.missingHealth;
    }

    else if (!keys.willpower)
    {
        tracker.error = errorType.missingWillpower;
    }

    return;
}

function updateCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Mortal();
    char.deserilize(tracker.character);
    char = modifyCharacter(keys, char);
    char = modifyMaxValues(keys, char);
    if (keys.exp != undefined) char.exp.modifiyCurrent(keys.exp);
    return char;
}



function setCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Mortal();
    char.deserilize(tracker.character);
    if (keys.exp != undefined) char.exp.incTotal(keys.exp);
    char = modifyCharacter(keys, char);
    char = modifyMaxValues(keys, char);
    return char;
}

function findCharacter(tracker)
{
    let char = new Mortal();
    char.deserilize(tracker.character);
    return  char;
}

function modifyCharacter(keys, char)
{
    char.setDate(Date.now());
    char.resetOverflows();
    if (keys.superficialWillpower != undefined) char.willpower.takeSuperfical(
        keys.superficialWillpower);
    if (keys.aggWillpower != undefined) char.willpower.takeAgg(
        keys.aggWillpower);
    if (keys.superficialHealth != undefined) char.health.takeSuperfical(
        keys.superficialHealth);
    if (keys.aggHealth != undefined) char.health.takeAgg(
        keys.aggHealth);
    if (keys.stains != undefined) char.humanity.takeStains(keys.stains);

    return char;
}

function modifyMaxValues(keys, char)
{
    if (keys.humanity != undefined) char.humanity.setTotal(keys.humanity);
    if (keys.willpower != undefined) char.willpower.setTotal(keys.willpower);
    if (keys.health != undefined) char.health.setTotal(keys.health);
    return char;
}