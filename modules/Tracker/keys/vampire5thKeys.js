module.exports =
{
    splat: 
    {
        name: "Splat: Vampire 5th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['v', 'vamp', 'vampire', 'lick'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
    hunger:
    {
        name: "Hunger",
        codeKey: 'hunger',
        keys: ['h', 'hunger'],
        constraints: {min: -100, max: 100},
        description: "The amount of hunger this vampire is suffering.\n" +
            "For a new character you enter the current amount of hunger." +
            "For updates enter the amount the value has changed. Eg -/+ 1",
        returnType: "int"
    },
}