module.exports =
{
    version: 
    {
        name: "Version: World of Darkness 20th edition",
        codeKey: 'version',
        keys: ['version', 'v', 'ver'],
        required: "When creating a new character",
        options: ['20', 'v20', '20th', 'w20'],
        description: "The World of Darkness version this character " +
            "belongs in",
        returnType: "version"
    },
    willpower:
    {
        name: "Willpower",
        codeKey: 'willpower',
        keys: ['w', 'wp', 'willpower'],
        required: "When creating a new character",
        constraints: {min: -50, max: 50},
        setConstraints: {min: 1, max: 15},
        consumable: 'Consumables work by updating their current value with' +
            ' the update command. To update their max values the new and set' +
            ' commands are used.',
        description: "The total and current willpower a character has.",
        returnType: "int"
    },
    bashing:
    {
        name: "Bashing Damage",
        codeKey: 'bashing',
        keys: ['bash', 'bashing'],
        constraints: {min: -50, max: 50},
        description: "The total bashing damage a character has accumulated.",
        returnType: "int"
    },
    lethal:
    {
        name: "Lethal Damage",
        codeKey: 'lethal',
        keys: ['lethal'],
        constraints: {min: -50, max: 50},
        description: "The total lethal damage a character has accumulated.",
        returnType: "int"
    },
    aggravated:
    {
        name: "Aggravated Damage",
        codeKey: 'aggravated',
        keys: ['agg', 'aggravated'],
        constraints: {min: -50, max: 50},
        description: "The total aggravated damage a character has accumulated.",
        returnType: "int"
    }
}
