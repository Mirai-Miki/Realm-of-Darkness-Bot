'use strict'
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { RealmError, ErrorCodes } = require('../../Errors');
const { canSendMessage } = require('../../modules');
const getButtonRow = require('../../modules/Initiative/getButtonRow');
const API = require('../../realmAPI');
const { InitiativeTracker } = require('../../structures');

module.exports = 
{
	data: getCommand(),
  async execute(interaction) 
  {
    await interaction.deferReply({ephemeral: true});    
    const channel = await getChannel(interaction);
    let tracker = await API.getInitTracker(channel.id);

    switch (interaction.options.getSubcommand())
    {
      case 'new':
        if (tracker) return { // Tracker Already active in channel
          embeds: 
            [new EmbedBuilder()        
            .setTitle("Start New Initiative?")
            .setDescription(
              "There is still an active tracker in this channel " +
              "would you still like to create a new one?\n" +
              "Note starting a new tracker will end the old one."
            )
            .setColor("#c914cc")],
          components: [getButtonRow.confirmNewTracker]
        }
        
        tracker = new InitiativeTracker({
          channelId: channel.id,
          guildId: interaction.guild.id,
          startMemberId: interaction.member.id
        });
        return await tracker.rollPhase(interaction);
      case 'roll':
        if (!tracker) throw new RealmError({code: ErrorCodes.InitNoTracker})
        return await tracker.characterRoll(interaction);
      case 'join':
        if (!tracker) throw new RealmError({code: ErrorCodes.InitNoTracker})
        return await tracker.characterJoin(interaction);
      case 'reroll':
        if (!tracker) throw new RealmError({code: ErrorCodes.InitNoTracker})
        return await tracker.characterRoll(interaction, true);
      case 'declare':
        if (!tracker) throw new RealmError({code: ErrorCodes.InitNoTracker})
        return await tracker.characterDeclare(interaction);
      case 'repost':
        if (!tracker) throw new RealmError({code: ErrorCodes.InitNoTracker})
        return await tracker.repost(interaction);
    }
  },
}


async function getChannel(interaction)
{
  if (!interaction.guild) throw new RealmError({code: ErrorCodes.GuildRequired});
  const channel = await canSendMessage({channel: interaction.channel});
  if (!channel) throw new RealmError({code: ErrorCodes.InvalidChannelPermissions});
  return channel;
}

function getCommand()
{
  return new SlashCommandBuilder()
		.setName('init')
		.setDescription('.')

	////////////////////// New Init Command ///////////////////////////////////
    .addSubcommand(subcommand => subcommand
			.setName('new')
			.setDescription('Creates a new Initiative tracker in this channel.')
    )

  ///////////////////// Roll init Command ///////////////////////////////////
    .addSubcommand(subcommand => subcommand
	    .setName('roll')
	    .setDescription('Rolls initiative for a specific character.')

      .addStringOption(option =>
        option.setName("name")
        .setDescription("The name of the character rolling.")
        .setMaxLength(50)
        .setRequired(true)
      )
         
      .addIntegerOption(option =>
        option.setName("dex_wits")
        .setDescription("Your Dexterity + Wits. Must be between 0 and 100.")
        .setMaxValue(100)
        .setMinValue(1)    
        .setRequired(true)
      )

      .addIntegerOption(option =>
        option.setName("modifier")
        .setDescription(
          "Any bonus or penalties that apply. " +
          "Must be between -50 and 50.")
        .setMaxValue(50)
        .setMinValue(-50)
      )

      .addIntegerOption(option =>
        option.setName("extra_actions")
        .setDescription(
          "Any additional actions you are allowed to take. " +
          "Must be between 1 and 5.")
        .setMaxValue(5)
        .setMinValue(1)
      )
    )

  ////////////////////// Reroll Init Command //////////////////////////////////
    .addSubcommand(subcommand => subcommand
		  .setName('reroll')
		  .setDescription('Rerolls the last roll for specific character.')
            
      .addStringOption(option =>
        option.setName("name")
        .setDescription("The name of the character rerolling.")
        .setMaxLength(50)
        .setRequired(true)
      )

      .addIntegerOption(option =>
        option.setName("modifier")
        .setDescription(
          "Any bonus or penalties that apply. " +
          "Must be between -50 and 50.")
        .setMaxValue(50)
        .setMinValue(-50)
      )

      .addIntegerOption(option =>
        option.setName("extra_actions")
        .setDescription(
          "Any additional actions you are allowed to take. " +
          "Must be between 1 and 5.")
        .setMaxValue(5)
        .setMinValue(1)
      )
    )
  
  /////////////////////// Declare Init Command ///////////////////////////////
    .addSubcommand(subcommand => subcommand
		  .setName('declare')
		  .setDescription('Declares the action for a specific character.' +
        " Can only be used on your turn.")
            
      .addStringOption(option =>
        option.setName("action")
        .setDescription("The action you will take.")
        .setMaxLength(150)
        .setRequired(true)
      )
    )

  ///////////////////////// Repost Init Command ///////////////////////////////
    .addSubcommand(subcommand => subcommand
		  .setName('repost')
		  .setDescription('Reposts a current tracker.')
    )

  ////////////////////// Join Init Command //////////////////////////////////
    .addSubcommand(subcommand => subcommand
      .setName('join')
      .setDescription('Joins the current round with the same Init')
            
      .addStringOption(option =>
        option.setName("name")
        .setDescription("The name of the character rerolling.")
        .setMaxLength(50)
        .setRequired(true)
      )
      
      .addIntegerOption(option =>
        option.setName("extra_actions")
        .setDescription(
          "Any additional actions you are allowed to take. " +
          "Must be between 1 and 5.")
        .setMaxValue(5)
        .setMinValue(1)
      )
    )
}