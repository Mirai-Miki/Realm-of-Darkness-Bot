const { MessageEmbed } = require('discord.js');

const rodBanner = "https://cdn.discordapp.com/attachments/" +
"699082447278702655/972058320611459102/banner.png";
const rodLink = "[RoD Server](https://discord.gg/Qrty3qKv95)";
const thumbnail = "https://cdn.discordapp.com/attachments/" +
        "817275006311989268/974198094696689744/error.png";
const errorColour = "#db0f20";

module.exports.ErrorEmbed = 
{    
    DBACCESS:  
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Database Access Error")
                .setDescription("There was an error accessing the Database and" +
                    " the command could not be completed." +
                    "\nIf the error persists please report it at the " +
                    `${rodLink}.`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    NOGUILD: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Direct Message Error")
                .setDescription("This command can only be used in a server" +
                    `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    NO_CHANNEL: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No channel Found Error")
                .setDescription("If you see this error, please report it at" +
                    ` ${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    NO_CHAR: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No Character Found Error")
                .setDescription("No character found with the name you specified." +
                    `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    NOT_TEXT_CHANNEL: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Wrong channel type Error")
                .setDescription("This command can only be used in a text channel." +
                    `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    VIEW_CHANNEL_PERMISSION: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("View Channel Permission Error")
                .setDescription('This command requires the "View Channel"' +
                    ` permission for this channel.\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    SEND_MESSAGE_PERMISSION: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Send Message Permission Error")
                .setDescription(`This command requires the "Send Messages"` +
                    ` permission for this channel.\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    EMBED_LINKS_PERMISSION: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Embed Links Permission Error")
                .setDescription(`This command requires the "Embed Links"` +
                    ` permission for this channel.\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    // Initiative Tracker Errors

    NO_INIT_TRACKER: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No Tracker Found!")
                .setDescription("Please use the `/init new` command to create" +
                    ` a new tracker before this can be used.\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    INVALID_PHASE: 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Invalid Command Error")
                .setDescription("Please use the `/init new` command to create" +
                    ` a new tracker. Otherwise please wait until the` +
                    ` Tracker asks you to use this command.\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    INVALID_TURN:
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Invalid Turn")
                .setDescription("It is not currently your turn " +
                    "to use this command. Please wait until it is." +
                    `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    // Arg Checking errors

    CHAR_LEN:
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("String Parse Error")
                .setDescription("Character name cannot be longer then 50 characters."
                    + `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    SPEC_LEN:
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("String Parse Error")
                .setDescription("Speciality cannot be longer then 100 characters."
                    + `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    NOTES_LEN:
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("String Parse Error")
                .setDescription("Notes cannot be longer then 300 characters."
                    + `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },

    BUTTON_PERM:
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Button Permission Error")
                .setDescription("Sorry, these buttons are not for you."
                    + `\n${rodLink}`)
                .setThumbnail(thumbnail)
                .setColor(errorColour)
                .setURL(rodBanner)
        ],
        components: [],
        ephemeral: true
    },
}