'use strict';

module.exports =
{
    splat: 
    {
        name: "Splat: Mortal 5th",
        codeKey: 'splat',
        keys: ['splat', 's', 'type', 't'],
        required: "When creating a new character",
        options: ['h', 'g', 'human', 'ghoul', 'mortal'],
        description: "The World of Darkness splat (type of creature) " +
            "that this character is. Eg Vampire or Werewolf",
        returnType: "splatKey"
    },
}