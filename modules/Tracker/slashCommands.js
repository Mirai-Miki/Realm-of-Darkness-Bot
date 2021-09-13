'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = function (command) 
{
    const slashCommand = new SlashCommandBuilder();

    if (command === 'new')
    {
        slashCommand.setName('new')
		    .setDescription('Create a new World of Darkness Character ' +
                'to be tracked.');
    }
    else if (command === 'update')
    {
        slashCommand.setName('update')
		    .setDescription('Update Character values using +/- values.');
    }
    else if (command === 'set')
    {
        slashCommand.setName('set')
		    .setDescription('Set Character values using an absolute value.');
    }

    slashCommand.addSubcommandGroup(subcommandgroup =>
        subcommandgroup
            .setName('vampire')
            .setDescription('vampires everywhere')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('20th')
                    .setDescription('Not the sparkly kind.')
                    .addStringOption(option =>
                        option.setName("name")
                        .setDescription("The name of your Character")
                        .setRequired(true))
                    .addIntegerOption(option =>
                        option.setName("willpower")
                        .setDescription("VtM 20th Corebook p120"))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('5th')
                    .setDescription("I didn't like the sun anyway.")
                    .addStringOption(option =>
                        option.setName("name")
                        .setDescription("The name of your Character")
                        .setRequired(true))
                    .addIntegerOption(option =>
                        option.setName("willpower")
                        .setDescription("VtM v5 Corebook p157"))
            )
    );
    
    slashCommand.addSubcommand(subcommand =>
        subcommand
            .setName('werewolf')
            .setDescription('Definitely a furry.')
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("WtA Corebook p146."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('changeling')
            .setDescription("All the world is made of faith, and trust, and pixie dust.")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("CtD Corebook p172."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('mage')
            .setDescription("You're a wizard Harry.")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("MtA Corebook p330."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('wraith')
            .setDescription("Death is not scary. It's where we'll end up that is.")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("WtO Corebook p115."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('demon')
            .setDescription('Pointy pitchforks and eternal flames are only' +
                " the beginning")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("DtF Corebook p162."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('ghoul_v20')
            .setDescription('Irradiated humans in a post apocalyptic world...' +
                " Right?")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("VtM 20th edition CoreBook p127."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('human_v20')
            .setDescription('Nobody realizes that some people expend ' +
                'tremendous energy merely to be normal.')
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("VtM 20th edition CoreBook p127."))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('mortal_v5')
            .setDescription("Your everyday John Doe.")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("p157"))
    );

    return slashCommand;
}