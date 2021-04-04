module.exports =
{
    splat: 
    {
        name: "Splat: Ghoul 20th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['g', 'ghoul'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    blood:
    {
        name: "Blood",
        codeKey: 'blood',
        keys: ['b', 'blood'],
        constraints: {min: -100, max: 100},
        setConstraints: {min: 0, max: 10},
        description: "The current amount of Blood a character has.",
        returnType: "int"
    },
    humanity:
    {
        name: "Humanity",
        codeKey: 'humanity',
        keys: ['h', 'humanity'],
        required: "When creating a new character",
        constraints: {min: -10, max: 10},
        setConstraints: {min: 0, max: 10},
        description: "The amount of Humanity this character has." +
            "\nEnter the current amount of humanity you have.",
        returnType: "int"
    },
    vitae:
    {
        name: "Vitae",
        codeKey: 'vitae',
        keys: ['vt', 'vitae'],
        constraints: {min: -10, max: 10},
        setConstraints: {min: 0, max: 5},
        description: "The amount of Vitae this character has.",
        returnType: "int"
    },
}
