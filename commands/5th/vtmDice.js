'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const { oneLineTrim } = require('common-tags');
const { vtmRoll, rouse, resonance, generalRoll } = 
  require('../../modules/dice/index');


const command = new SlashCommandBuilder()
  .setName('vtm')
  .setDescription('Dice rolls for the vtm v5 Game.');


///////////////////////// VtM Roll Command //////////////////////
command.addSubcommand((subcommand) => subcommand
  .setName('roll')
  .setDescription(oneLineTrim`
    Makes a dice roll following the standard Vampire: 
    the Masquerade v5 rules. page 117 Corebook
  `)
  
  .addIntegerOption(option => {
    option.setName("pool")
    .setDescription(oneLineTrim`
      The base pool you will be rolling whith, can be modified by other 
      arguments. p118 corebook
    `)
    .setMaxValue(50)
    .setMinValue(1)
    .setRequired(true)
    return option;
  })

  .addIntegerOption(option => {
    option.setName("hunger")
    .setDescription("The number of hunger dice included in " +
      "the pool. Must be between 0 to 5. Defaults to 0. p205")
    .setMaxValue(5)
    .setMinValue(0)
    return option;
  })

  .addIntegerOption(option => {
    option.setName("difficulty")
    .setDescription("The Difficulty is the number of dice " +
      " 6+ needed. Must be between 1 and 50." +
      " Defaults to 1. p119")
    .setMaxValue(50)
    .setMinValue(1)
    return option;
  })
  
  .addIntegerOption(option => {
    option.setName("blood_surge")
    .setDescription("Enter your current " +
      " Blood Potency. Must be between 0 and 10. Also Rouses the blood. p218")
    .setMaxValue(10)
    .setMinValue(0)
    return option;
  })
  
  .addStringOption(option => {
    option.setName("speciality")
    .setDescription("The speciality applied to the roll. " +
      " This adds one dice to your pool. p159")
    .setMaxLength(100)
    return option;
  })
  
  .addStringOption(option => {
    option.setName("rouse")
    .setDescription("Select if you would also like to Rouse the blood. p211")
    .setChoices(
      {name: 'No Reroll', value: 'No Reroll'},
      {name: 'Reroll', value: 'Reroll'}
    )
    return option;
  })

  .addStringOption(option => {
    option.setName("character")
    .setDescription("Name of the character making the roll.")
    .setMaxLength(50)
    return option;
  })

  .addBooleanOption(option => {
    option.setName("auto_hunger")
    .setDescription("Select if you would like your hunger" +
      " to be taken from your character.")
      return option;
    })

  .addStringOption(option => {
    option.setName("notes")
    .setDescription("Any extra information you would like to include about this roll.")
    .setMaxLength(300)
    return option;
  })
);
      
///////////////////// Rouse Command //////////////////////
command.addSubcommand(subcommand => 
  subcommand.setName('rouse')
  .setDescription('Rouse the blood for special feats. p211')

  .addBooleanOption(option => {
    option.setName("reroll")
    .setDescription("Select if you are able to roll 2 dice. p211")
    return option;
  })

  .addStringOption(option => {
    option.setName("character")
    .setDescription("Name of the character making the roll.")
    .setMaxLength(50)
    return option;
  })

  .addStringOption(option => {
    option.setName("notes")
    .setDescription("Any extra information you would like to include about this roll.")
    .setMaxLength(300)
    return option;
  })      
);

/////////////////// Resonance Command ///////////////////
command.addSubcommand(subcommand => 
  subcommand.setName('resonance')
  .setDescription('Temperament and Resonance roll. p228')
  
  .addStringOption(option => {
    option.setName("resonance")
    .setDescription("Select if you already know the what" +
      " the resonance will be.")
    .addChoices(
      {name: 'Phlegmatic', value: 'Phlegmatic'},
      {name: 'Melancholy', value: 'Melancholy'},
      {name: 'Choleric', value: 'Choleric'},
      {name: 'Sanguine', value: 'Sanguine'}
    )
    return option;
  })

  .addStringOption(option => {
    option.setName("temperament")
    .setDescription("Select if you already know the what the temperament will be.")
    .addChoices(
      {name: 'Fleeting', value: 'Fleeting'},
      {name: 'Intense', value: 'Intense'},
      {name: 'Acute', value: 'Acute'}
    )
    return option;
  })

  .addStringOption(option => {
    option.setName("min_temperament")
    .setDescription("The lowest the temperament will be.")
    .addChoices(
      {name: 'Fleeting', value: 'Fleeting'},
      {name: 'Intense', value: 'Intense'}
    )
    return option;
  })
    
  .addStringOption(option => {
    option.setName("notes")
    .setDescription("Any extra information you would like to include about this roll.")
    .setMaxLength(300)
    return option;
  })
);

/////////////////// General Roll Command ///////////////////////
command.addSubcommand(subcommand => 
  subcommand.setName('general')
  .setDescription('Roll a number of X-sided dice.')

  .addStringOption(option => {
    option.setName("dice_set_01")
    .setDescription('A dice set is defined as "(x)d(y)"' +
      ' where (x) is the number of dice and (y) is the number of sides.')
    .setRequired(true)
    .setMaxLength(9)
    return option;
  })

  .addIntegerOption(option => {
    option.setName("modifier")
    .setDescription('Adds or removes the number from the total.')
    .setMaxValue(1000)
    .setMinValue(-1000)
    return option;
  })

  .addStringOption(option => {
    option.setName("dice_set_02")
    .setDescription('A dice set is defined as "(x)d(y)"' +
      ' where (x) is the number of dice and (y) is the number of sides.')
    .setMaxLength(9)
    return option;
  })

  .addStringOption(option => {
    option.setName("dice_set_03")
    .setDescription('A dice set is defined as "(x)d(y)"' +
      ' where (x) is the number of dice and (y) is the number of sides.')
    .setMaxLength(9)
    return option;
  })

  .addStringOption(option => {
    option.setName("dice_set_04")
    .setDescription('A dice set is defined as "(x)d(y)"' +
      ' where (x) is the number of dice and (y) is the number of sides.')
    .setMaxLength(9)
    return option;
  })

  .addStringOption(option => {
    option.setName("dice_set_05")
    .setDescription('A dice set is defined as "(x)d(y)"' +
      ' where (x) is the number of dice and (y) is the number of sides.')
    .setMaxLength(9)
    return option;
  })

  .addIntegerOption(option => {
    option.setName("difficulty")
    .setDescription('The total needed to pass the Roll.')
    .setMaxValue(1000)
    .setMinValue(1)
    return option;
  })

  .addStringOption(option => {
    option.setName("notes")
    .setDescription('Any extra information you would like to include about this roll.')
    .setMaxLength(300)
    return option;
  })
);

module.exports = {
	data: command,	
	async execute(interaction) 
  {
    await interaction.deferReply();
		switch (interaction.options.getSubcommand())
    {
      case 'roll':
        return await vtmRoll(interaction);
      case 'resonance':
        return resonance(interaction);
      case 'rouse':   
        return await rouse(interaction);     
      case 'general':
        return generalRoll(interaction);
    }
	}
};