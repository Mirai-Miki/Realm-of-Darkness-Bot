'use strict';

module.exports =
{
    splat: 
    {
        name: "Splat: Demon the Fallen",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['d', 'demon'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    faith:
    {
        name: "Faith",
        codeKey: 'faith',
        keys: ['f', 'faith'],
        constraints: {min: -100, max: 100},
        setConstraints: {min: 0, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The current amount of Faith a character has.",
        returnType: "int"
    },
    permTorment:
    {
        name: "Permanent Torment",
        codeKey: 'permTorment',
        keys: ['pt', 'permtorment'],
        required: "When creating a new character",
        constraints: {min: -10, max: 10},
        setConstraints: {min: 0, max: 10},
        description: "The amount of Permanent Torment this character has.",
        returnType: "int"
    },
    tempTorment:
    {
        name: "Temporary Torment",
        codeKey: 'tempTorment',
        keys: ['tt', 'temptorment'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The amount of Temporary Torment this character has.",
        returnType: "int"
    },
}
