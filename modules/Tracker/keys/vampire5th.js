module.exports =
{
    splat: 
    {
        name: "Splat: Vampire",
        codeKey: 'splat',
        keys: ['v', 'vamp', 'vampire', 'lick'],
        description: "The World of Darkness splat (type of creatue) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "string"
    },
    hunger:
    {
        name: "Hunger",
        codeKey: 'hunger',
        keys: ['h', 'hunger'],
        description: "The amount of hunger this vampire is suffering.\n" +
            "For a new character you enter the current amount of hunger." +
            "For updates enter the amount the value has changed. Eg -/+ 1",
        returnType: "int"
    },
}