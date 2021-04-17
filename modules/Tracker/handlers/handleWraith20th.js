const mode = require('../TypeDef/mode.js');
const errorType = require('../TypeDef/errors.js');
const Wraith = require('../characters/Wraith20th.js');
const { serializeCharacter } = require('../util/serilizeCharacter.js');
// Key handling
const CharacterKeys = require('../keys/CharacterKeys.js');
const Character20thKeys = require('../keys/Character20thKeys.js');
const Wraith20thKeys = require('../keys/wraith20thKeys.js');
const { sortKeys } = require('../keys/SortKeys.js');
// Create Embed
const { character20thEmbed } = require('../embed/character20thEmbed.js');

module.exports =
{
    name: 'Wraith 20th Edition',
    version: 'v20',
    splat: 'Wraith',
    keyHelp: 'wraith20th',    

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
        return character20thEmbed(character, tracker, unknownKeys);
    },

    getKeys()
    {
        return {...Character20thKeys, ...Wraith20thKeys, ...CharacterKeys};
    }
}

/////////////////////////// Private Helper Functions ///////////////////////////

function newCharacter(tracker, keys)
{
    if (tracker.error) return;
    newKeyCheck(tracker, keys);
    if (tracker.error) return;

    let char = new Wraith();
    
    char.setName(tracker.name);
    char.setOwner(tracker.recvMess.author.id);
    char.setGuild(tracker.guild);
    char = modifyFields(keys, char);
    char.updateHistory(keys, tracker.notes, "New");
    if (keys.corpus != undefined) char.corpus.setTotal(keys.corpus);
    if (keys.pathos != undefined) char.pathos.setCurrent(keys.pathos);
    if (keys.exp != undefined) char.exp.updateTotal(keys.exp);
    return char;
}

function newKeyCheck(tracker, keys)
{
    if (!keys.pathos)
    {
        tracker.error = errorType.missingPathos;
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
    let char = new Wraith();
    char.deserilize(tracker.character);
    char = modifyFields(keys, char);
    char = updateConsumables(keys, char);
    char.updateHistory(keys, tracker.notes, "Update");
    if (keys.pathos != undefined) char.pathos.modifiyCurrent(keys.pathos);
    return char;
}

function setCharacter(tracker, keys)
{
    if (tracker.error) return;
    let char = new Wraith();
    char.deserilize(tracker.character);
    char = modifyFields(keys, char);
    char.updateHistory(keys, tracker.notes, "Set");
    if (keys.willpower != undefined) 
        char.willpower.updateTotal(keys.willpower);
    if (keys.exp != undefined) char.exp.incTotal(keys.exp);
    if (keys.corpus != undefined) char.corpus.updateTotal(keys.corpus);
    if (keys.pathos != undefined) char.pathos.setCurrent(keys.pathos);
    return char;
}

function findCharacter(tracker)
{
    let char = new Wraith();
    char.deserilize(tracker.character);
    return char;
}

function modifyFields(keys, char)
{
    char.resetOverflows();
    char.setUpdateDate();    
    if (keys.bashing != undefined) char.health.updateBashing(keys.bashing);
    if (keys.lethal != undefined) char.health.updateLethal(keys.lethal);
    if (keys.aggravated != undefined) char.health.updateAgg(keys.aggravated);
    return char;
}

function updateConsumables(keys, char)
{
    if (keys.willpower != undefined) 
        char.willpower.modifiyCurrent(keys.willpower);
    if (keys.exp > 0) char.exp.modifiyCurrent(keys.exp);
    else if (keys.exp != undefined) char.exp.modifiyCurrent(keys.exp);
    if (keys.corpus != undefined) char.corpus.modifiyCurrent(keys.corpus);
    return char;
}