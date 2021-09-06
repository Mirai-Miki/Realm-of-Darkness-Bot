module.exports =
{
    splat: 
    {
        name: "Splat: Vampire 20th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['v', 'vamp', 'vampire', 'lick'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    blood:
    {
        name: "Blood",
        codeKey: 'blood',
        keys: ['b', 'blood'],
        required: "When creating a new character",
        constraints: {min: -100, max: 100},
        setConstraints: {min: 1, max: 100},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current Blood a character has.",
        returnType: "int"
    },
    humanity:
    {
        name: "Humanity",
        codeKey: 'humanity',
        keys: ['h', 'humanity', 'path', 'p'],
        required: "When creating a new character",
        constraints: {min: -10, max: 10},
        setConstraints: {min: 0, max: 10},
        description: "The amount of Humanity this character has." +
            "\nEnter the current amount of humanity you have.",
        returnType: "int"
    },
}
