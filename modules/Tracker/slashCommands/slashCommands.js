'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const { vampire20thNewCommands, vampire20thUpdateCommands, 
    vampire20thSetCommands } = require('./vampire20th.js');

module.exports.newCommand = () => 
{
    const slashCommand = new SlashCommandBuilder();
    
    slashCommand.setName('new')
	    .setDescription('Create a new World of Darkness Character ' +
            'to be tracked.');

    slashCommand.addSubcommandGroup((subcommandgroup) => 
    {
        subcommandgroup.setName('vampire')
            .setDescription('vampires everywhere');
        
        vampire20thNewCommands(subcommandgroup);
        subcommandgroup.addSubcommand(subcommand =>
            subcommand
                .setName('v5')
                .setDescription("I didn't like the sun anyway.")
                .addStringOption(option =>
                    option.setName("name")
                    .setDescription("The name of your Character")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("willpower")
                    .setDescription("VtM v5 Corebook p157"))
        );
        return subcommandgroup;
    });

    return slashCommand;
}

module.exports.updateCommand = () => 
{
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName('update')
	    .setDescription('Update Character values using +/- values.');

    slashCommand.addSubcommandGroup(subcommandgroup =>
    {
        subcommandgroup.setName('vampire')
            .setDescription('vampires everywhere');
        
        vampire20thUpdateCommands(subcommandgroup);
        subcommandgroup.addSubcommand(subcommand => subcommand
            .setName('v5')
            .setDescription("I didn't like the sun anyway.")
            .addStringOption(option =>
                option.setName("name")
                .setDescription("The name of your Character")
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName("willpower")
                .setDescription("VtM v5 Corebook p157"))
        );
        return subcommandgroup;
    });
    
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
            .setName('ghoul_20th')
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
            .setName('human_20th')
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
                .setDescription("VtM v5 Corebook p157"))
    );

    return slashCommand;
}

module.exports.setCommand = () => 
{
    const slashCommand = new SlashCommandBuilder();
    
    slashCommand.setName('set')
	    .setDescription('Set Character values using an absolute value.');


    slashCommand.addSubcommandGroup(subcommandgroup =>
    {
        subcommandgroup.setName('vampire')
            .setDescription('vampires everywhere')
            
        vampire20thSetCommands(subcommandgroup);
        subcommandgroup.addSubcommand(subcommand =>
            subcommand
                .setName('v5')
                .setDescription("I didn't like the sun anyway.")
                .addStringOption(option =>
                    option.setName("name")
                    .setDescription("The name of your Character")
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("willpower")
                    .setDescription("VtM v5 Corebook p157"))
        );
        return subcommandgroup;
    });
    
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
            .setName('ghoul_20th')
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
            .setName('human_20th')
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
                .setDescription("VtM v5 Corebook p157"))
    );

    return slashCommand;
}