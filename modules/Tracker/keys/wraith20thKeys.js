'use strict';

module.exports =
{
    splat: 
    {
        name: "Splat: Wraith 20th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['wr', 'wraith'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    corpus:
    {
        name: "Corpus",
        codeKey: 'corpus',
        keys: ['c', 'corpus'],
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Corpus a character has.",
        returnType: "int"
    },
    pathos:
    {
        name: "Pathos",
        codeKey: 'pathos',
        keys: ['p', 'pathos'],
        required: "When creating a new character",
        constraints: {min: -100, max: 100},
        setConstraints: {min: 0, max: 10},
        description: "The total and current Gnosis a character has.",
        returnType: "int"
    },
}
