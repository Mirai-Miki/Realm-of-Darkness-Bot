const mode = require('../TypeDef/mode.js');
const errorType = require('../TypeDef/errors.js');
const Vampire = require('../characters/Vampire5th.js');
const { serializeCharacter } = require('../util/serilizeCharacter.js');
// Key handling
const Character5thKeys = require('../keys/Character5th.js');
const Vampire5thKeys = require('../keys/vampire5th.js');
const { sortKeys } = require('../keys/SortKeys.js');
// Create Embed
const { character5thEmbed } = require('../embed/character5thEmbed.js');
const Vampire5th = require('../characters/Vampire5th.js');

module.exports =
{
    name: 'Vampire 5th Edition',
    version: 'v5',
    splat: 'Vampire',
    keyHelp: '/keys vampire5th',    

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
            default:
                console.error("Hit default case in handler");
                return 'Handler Error: Default Case';
        }
        if (!tracker.error) serializeCharacter(character);
        return character5thEmbed(character, tracker);
    },

    getKeys()
    {
        return {...Character5thKeys, ...Vampire5thKeys};
    }
}

/////////////////////////// Private Helper Functions ///////////////////////////

function newCharacter(tracker, keys)
{
    if (tracker.error) return;
    newKeyCheck(tracker, keys);
    if (tracker.error) return;

    if (keys.hunger != undefined) keys.hunger -= 1;
    let char = new Vampire(keys.health, keys.willpower, 
        keys.humanity);
    
    char.setName(tracker.name);
    char.setOwner(tracker.recvMess.author.id);
    char.setGuild(tracker.guild);
    char = modifyCharacter(keys, char);
    
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
    // update character
    // take character
    // update with keys

    let char = new Vampire5th();
    char.deserilize(tracker.character);
    char = modifyCharacter(keys, char);
    char = modifyMaxValues(keys, char);
    console.log(char);
    return char;
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
    if (keys.hunger != undefined) char.hunger.modifiyCurrent(keys.hunger);

    return char;
}

function modifyMaxValues(keys, char)
{
    if (keys.humanity != undefined) char.humanity.setTotal(keys.humanity);
    if (keys.willpower != undefined) char.willpower.setTotal(keys.willpower);
    if (keys.health != undefined) char.health.setTotal(keys.health);
    return char;
}

function setCharacter(tracker, keys)
{
    if (tracker.error) return;
    // set character
    // same as above but on consumable max values
}