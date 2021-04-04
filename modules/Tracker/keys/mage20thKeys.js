module.exports =
{
    splat: 
    {
        name: "Splat: Mage 20th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['m', 'mage'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    arete:
    {
        name: "Arete",
        codeKey: 'arete',
        keys: ['a', 'arete'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The current Arete a character has.",
        returnType: "int"
    },
    quintessence:
    {
        name: "Quintessence",
        codeKey: 'quintessence',
        keys: ['q', 'quint', 'quintessence'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The current Quintessence a character has.",
        returnType: "int"
    },
    paradox:
    {
        name: "Paradox",
        codeKey: 'paradox',
        keys: ['p', 'paradox'],
        constraints: {min: -20, max: 20},
        setConstraints: {min: 0, max: 10},
        description: "The current Paradox a character has.",
        returnType: "int"
    },
}
