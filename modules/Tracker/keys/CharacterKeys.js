module.exports =
{
    exp: 
    {
        name: "Experiance",
        codeKey: 'exp',
        keys: ['exp', 'xp', 'experiance'],
        constraints: {min: -5000, max: 5000},
        setConstraints: {min: 1, max: 5000},
        consumable: 'This key is a consumable but unlike the others using set' +
            ' command you do not enter the max values rather a +/- value' +
            ' which will increment the total by that amount.',
        description: "The amount of Experiance this character has accumulated" +
            ' and spent.',
        returnType: "int"
    },
}
