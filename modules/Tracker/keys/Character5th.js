module.exports =
{
    version: 
    {
        name: "Version: World of Darkness 5th edition",
        codeKey: 'version',
        keys: ['5', 'v5', '5th'],
        description: "The World of Darkness version this character " +
            "belongs in",
        returnType: "string"
    },
    humanity:
    {
        name: "Humanity",
        codeKey: 'humanity',
        keys: ['hm', 'humanity'],
        description: "The amount of Humanity this character has." +
            "\nEnter the current amount of humanity you have.",
        returnType: "int"
    },
    stains:
    {
        name: "Stains",
        codeKey: 'stains',
        keys: ['s', 'stain', 'stains'],
        description: "The current amount of stains this character has.\n" +
            "Enter the amount the value has changed. Eg +/- 1." +
            " Entering 0 will remove all stains.",
        returnType: "int"
    },
    willpower:
    {
        name: "Willpower",
        codeKey: 'willpower',
        keys: ['w', 'wp', 'willpower'],
        description: "The total amount of undamaged willpower this" +
            " character has.\n Enter the total amount of willpower this" +
            " character has.",
        returnType: "int"
    },
    health:
    {
        name: "Health",
        codeKey: 'health',
        keys: ['d', 'health', 'damage'],
        description: "The total amount of undamaged Health this" +
        " character has.\n Enter the total amount of willpower this" +
        " character has.",
        returnType: "int"
    },
    superficialWillpower:
    {
        name: "Superficial Willpower Damage",
        codeKey: 'superficialWillpower',
        keys: ['sw', 'swp', 'superficialwillpower'],
        description: "The current amount of Superficial Willpower damage" +
        " this character has.\n" +
        "Enter the amount the value has changed. Eg +/- 1." +
        " Entering 0 will remove all damage.",
        returnType: "int"
    },
    aggWillpower:
    {
        name: "Aggravated Health Damage",
        codeKey: 'aggWillpower',
        keys: ['aw', 'aggw', 'aggwp', 'aggwillpower', 'aggravatedwillpower'],
        description: "The current amount of Aggravated Willpower damage" +
        " this character has.\n" +
        "Enter the amount the value has changed. Eg +/- 1." +
        " Entering 0 will remove all damage.",
        returnType: "int"
    },
    superficialHealth:
    {
        name: "Superficial Health Damage",
        codeKey: 'superficialHealth',
        keys: ['sh', 'sd', 'superficialhealth', 'superficialdamage'],
        description: "The current amount of Superficial Health damage" +
        " this character has.\n" +
        "Enter the amount the value has changed. Eg +/- 1." +
        " Entering 0 will remove all damage.",
        returnType: "int"
    },
    aggHealth:
    {
        name: "Aggravated Health Damage",
        codeKey: 'aggHealth',
        keys: ['ah', 'ad', 'aggd', 'aggh', 'agghealth', 'aggdamage'],
        description: "The current amount of Aggravated Health damage" +
        " this character has.\n" +
        "Enter the amount the value has changed. Eg +/- 1." +
        " Entering 0 will remove all damage.",
        returnType: "int"
    }
}
