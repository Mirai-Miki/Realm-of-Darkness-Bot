'use strict';

module.exports =
{
    splat: 
    {
        name: "Splat: Changeling",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['c', 'fae', 'changeling', 'cl'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    glamour:
    {
        name: "Glamour",
        codeKey: 'glamour',
        keys: ['g', 'glam', 'glamour'],
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Glamour a character has.",
        returnType: "int"
    },
    banality:
    {
        name: "Banality",
        codeKey: 'banality',
        keys: ['b', 'bane', 'banality'],
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Banality a character has.",
        returnType: "int"
    },
    nightmare:
    {
        name: "Nightmare",
        codeKey: 'nightmare',
        keys: ['n', 'nm', 'nightmare'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The current Nightmare a character has.",
        returnType: "int"
    },
    imbalence:
    {
        name: "Imbalance",
        codeKey: 'imbalance',
        keys: ['i', 'imbalance'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The current Imbalance a character has.",
        returnType: "int"
    },
    chimBashing:
    {
        name: "Chimerical Bashing Damage",
        codeKey: 'chimBashing',
        keys: ['cbash', 'cbashing'],
        constraints: {min: -50, max: 50},
        description: "The total Chimerical bashing damage a character has accumulated.",
        returnType: "int"
    },
    chimLethal:
    {
        name: "Chimerical Lethal Damage",
        codeKey: 'chimLethal',
        keys: ['clethal'],
        constraints: {min: -50, max: 50},
        description: "The total Chimerical lethal damage a character has accumulated.",
        returnType: "int"
    },
    chimAggravated:
    {
        name: "Chimerical Aggravated Damage",
        codeKey: 'chimAggravated',
        keys: ['cagg', 'caggravated'],
        constraints: {min: -50, max: 50},
        description: "The total Chimerical aggravated damage a character has accumulated.",
        returnType: "int"
    }
}
