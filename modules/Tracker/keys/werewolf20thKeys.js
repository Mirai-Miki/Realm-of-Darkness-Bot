module.exports =
{
    splat: 
    {
        name: "Splat: Werewolf 20th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['w', 'wolf', 'werewolf', 'garou'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    rage:
    {
        name: "Rage",
        codeKey: 'rage',
        keys: ['r', 'rage'],
        required: "When creating a new character",
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Rage a character has.",
        returnType: "int"
    },
    gnosis:
    {
        name: "Gnosis",
        codeKey: 'gnosis',
        keys: ['g', 'gnosis'],
        required: "When creating a new character",
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 10},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Gnosis a character has.",
        returnType: "int"
    },
}
