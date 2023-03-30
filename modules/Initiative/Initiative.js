'use strict';
const { EmbedBuilder } = require('discord.js');
const { InitTracker } = require("./InitTracker.js");
const { InitCharacter } = require("../../structures/InitiativeCharacter.js");

const { RealmError, ErrorCodes } = require('../../Errors');
const canSendMessage = require('../canSendMessage');
const getButtonRow = require('./getButtonRow');
const API = require('../../realmAPI');
const { ComponentCID } = require("../../Constants");
const { InitiativeTracker } = require('../../structures');



module.exports.Initiative = class Initiative
{
    /**
     * Sets the current Phase for the tracker
     * Responds to the interaction with a tracker embed
     * @param {Interaction} interaction 
     * @param {InitPhase} phase 
     * @param {TextChannel} chan TextChannel to be used
     * @returns
     */
    static async setPhase(interaction, phase, chan=undefined)
    {
        const channel = chan ? chan : await canSendChannelMessage(interaction);

        let json;
        try {json = await InitAPI.getTracker(interaction)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {
                return await interaction.editReply(ErrorEmbed.DBACCESS);
            }
            else if (error instanceof NoInitTrackerError)
            {
                if (phase !== InitPhase.NEW) 
                    return await interaction.editReply(ErrorEmbed.NOTRACKER);
                json = undefined;
            }            
        } 

        const tracker = new InitTracker();
        let nextChar = null;
        if (phase !== InitPhase.NEW && json)
        {
            tracker.fromJSON(json);
            await tracker.fetchMembers(interaction.guild);             
        }
        if (phase === InitPhase.ROLL)
        {
            tracker.currentRound++;
            tracker.characters.forEach((character) => {character.rolled = false;});
        }
        if (phase === InitPhase.DECLARE)
        {       
            tracker.characters.sort(sortInitDescending); 
            // Sorts members in reverse order of Initiative

            nextChar = tracker.characters.first();
            nextChar = `<@${nextChar.memberId}>`;
        }
        tracker.phase = phase;

        const embed = InitEmbed.construct(tracker);        
        const buttonRow = ButtonRow.getButtonRow(phase);        
        const ret = {content: nextChar, embeds: [embed], components: [buttonRow]};

        let message;        
        try
        {
            message = await channel.send(ret);
        }
        catch(error)
        {
            console.error("\n\nFailed to send Init newTracker");
            console.error(error);
            return;
        }

        try {await InitAPI.setPhase(interaction, message.id, phase)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {   
                await interaction.editReply(ErrorEmbed.DBACCESS);
                await message.delete();
                return;
            }            
        }

        if (json)
        {
            let oldMessage;        
            try
            {
                oldMessage = await channel.messages.fetch(json.messageId); 
                if (phase === InitPhase.NEW)
                {
                    await oldMessage.edit({components: []});
                }
                else
                {
                    await oldMessage.delete();
                }            
            }
            catch(error) {}     
        }   
        await interaction.editReply("Ready to go!");     
    }

   /**
    * Initiative Roll Command: [{name}, {dex_wits}, modifier]
    * Rolls the characters init and puts the data up in the post hidden
    * read for the button to be clicked
    * If two people rolled add next round button (Reveal Order)
    * @param {Interaction} interaction 
    * @param {boolean} reroll
    * @returns 
    */
    static async roll(interaction, reroll=false)
    {
        const channel = await canSendChannelMessage(interaction);   
        if (!channel) return;    

        let json;
        try {json = await InitAPI.getTracker(interaction, true)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {
                return await interaction.editReply(ErrorEmbed.DBACCESS);
            }
            else if (error instanceof NoInitTrackerError)
            {
                return await interaction.editReply(ErrorEmbed.NOTRACKER);
            }            
        }

        if (json.lockout)
        {
            // Trying to avoid race conditions
            // May still hit a race condition if someone else goes at 
            // the same time again.
            // Cannot wait indefinately incase the DB is incorrectly locked
            await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds
            try {json = await InitAPI.getTracker(interaction, true)}
            catch(error) 
            {
                if (error instanceof DatabaseAccessError)
                {
                    return await interaction.editReply(ErrorEmbed.DBACCESS);
                }
                else if (error instanceof NoInitTrackerError)
                {
                    return await interaction.editReply(ErrorEmbed.NOTRACKER);
                }            
            }
        }
        
        const tracker = new InitTracker().fromJSON(json);
        
        if (tracker.phase !== InitPhase.ROLL)
        {
            return await interaction.editReply(ErrorEmbed.INVALID_PHASE);
        }

        const name = interaction.options.getString('name');
        let character = tracker.characters
            .get(`${interaction.user.id}|${name.toLowerCase()}`);        

        if (!reroll)
        {
            if (!character) character = 
                new InitCharacter({memberId: interaction.user.id});
            character.setName(name);
            character.setPool(interaction.options.getInteger('dex_wits'));
            character.setMod(interaction.options.getInteger('modifier') ?? 0);
        }
        else if (!character) 
        {
            return await interaction.editReply(ErrorEmbed.NO_CHAR);
        }
        
        character.rollInit();
        character.setRolled(true);

        tracker.characters.set(`${interaction.user.id}|${name}`, character);
        
        try {await tracker.fetchMembers(interaction.guild)}
        catch(error) 
        {
            if (error instanceof FetchMemberError)
            {

            }
            //TODO handle error
            return;
        }

        const embed = InitEmbed.construct(tracker);
        //TODO try catch to catch potential errors
        
        let buttonRow;
        if (tracker.rolledCount() < 2)
        {
            buttonRow = ButtonRow.rollPhaseOne;
        }
        else
        {
            buttonRow = ButtonRow.rollPhaseTwo;
        }
        
        const ret = {embeds: [embed], components: [buttonRow]};
        let message;    
        const oldMessageId = tracker.messageId.toString();

        try
        {
            message = await channel.send(ret);
        }
        catch(error)
        {
            console.error("\n\nFailed to send Init newTracker");
            console.error(error);
            return;
        }

        tracker.messageId = message.id;
        try {await InitAPI.roll(tracker, character)}
        catch(error)
        {
            if (error instanceof DatabaseAccessError)
            {                
                await message.delete();
                await interaction.editReply(ErrorEmbed.DBACCESS);
                return;
            }
            console.error("\n\nError at Initiative.roll(): API send");
            console.error(error);
            return;
        }
        
        let modifier = "";
        if (character.mod) modifier = ` and a modifier of <${character.mod}>`;
        await interaction.editReply({
            content: `You have rolled` +
                ` with a Dex+Wits of <${character.pool}>${modifier}\n` +
                "If this is not correct please reroll before everyone " +
                "is ready!",
            ephemeral: true
        });
        
        try
        {
            let oldMessage = await channel.messages.fetch(oldMessageId);
            await oldMessage.delete()
        }
        catch(error){} 
    }

    /*
    Initiative Declare command
    Only available on declare phase
    Only available on your turn
    From decending order
    Adds action to bar and stores in DB
    */
    static async declare(interaction)
    {
        const channel = await canSendChannelMessage(interaction);  
        if (!channel) return;     

        let json;
        try {json = await InitAPI.getTracker(interaction)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {
                return await interaction.editReply(ErrorEmbed.DBACCESS);
            }
            else if (error instanceof NoInitTrackerError)
            {
                return await interaction.editReply(ErrorEmbed.NOTRACKER);
            }            
        }
        
        const tracker = new InitTracker().fromJSON(json);
        
        if (tracker.phase !== InitPhase.DECLARE)
        {
            return await interaction.editReply(ErrorEmbed.INVALID_PHASE);
        }

        tracker.characters.sort(sortInitDescending); 
        // Sorts members in reverse order of Initiative
        
        let currentChar;
        let nextChar = null;
        let tag = null;
        for (const character of tracker.characters.values())
        {
            if (character.rolled && !currentChar && !character.declared)
            {
                currentChar = character;
                currentChar.declared = true;
                currentChar.action = interaction.options.getString("action");
            }
            else if (currentChar)
            {
                nextChar = character;
                tag = `<@${nextChar.memberId}>`
                break;
            }
        }
        
        if (!nextChar)
        {
            tracker.phase = InitPhase.DECLARED
        }

        if (currentChar.memberId != interaction.user.id)
        {
            return await interaction.editReply(ErrorEmbed.INVALID_TURN);
        }
        
        try {await tracker.fetchMembers(interaction.guild)}
        catch(error) 
        {
            if (error instanceof FetchMemberError)
            {

            }
            //TODO handle error
            return;
        }

        const embed = InitEmbed.construct(tracker);
        //TODO try catch to catch potential errors
        
        let buttonRow;
        if (!nextChar)
        {
            buttonRow = ButtonRow.declarePhaseTwo;
        }
        else
        {
            buttonRow = ButtonRow.declarePhaseOne;
        }
        
        const ret = {content: tag, embeds: [embed], components: [buttonRow]};
        let message;    
        const oldMessageId = tracker.messageId.toString();
        try
        {
            message = await channel.send(ret);
        }
        catch(error)
        {
            console.error("\n\nFailed to send Init newTracker");
            console.error(error);
            return;
        }

        tracker.messageId = message.id;
        try {await InitAPI.declare(interaction, tracker, currentChar)}
        catch(error)
        {
            if (error instanceof DatabaseAccessError)
            {                
                await message.delete();
                await interaction.editReply(ErrorEmbed.DBACCESS);
                return;
            }
            console.error("\n\nError at Initiative.declare(): API send");
            console.error(error);
            return;
        }
        
        try
        {
            let oldMessage = await channel.messages.fetch(oldMessageId);
            await oldMessage.delete()
        }
        catch(error){} // Do nothing if message doesn't exist

        await interaction.editReply("Your action has been declared!");
    }   

    /*
    Initiative Repost Command
    Delete old message
    Repost init with info and buttons
    Update message ID
    */
    static async repostTracker(interaction)
    {
        const channel = await canSendChannelMessage(interaction);
        if (!channel) return;

        let json;
        try {json = await InitAPI.getTracker(interaction, true)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {
                return await interaction.editReply(ErrorEmbed.DBACCESS);
            }
            else if (error instanceof NoInitTrackerError)
            {
                return await interaction.editReply(ErrorEmbed.NOTRACKER);
            }            
        }

        if (!json) return; // shouldn't get to this

        const tracker = new InitTracker().fromJSON(json);
        try {await tracker.fetchMembers(interaction.guild)}
        catch(error) 
        {
            if (error instanceof FetchMemberError)
            {

            }
            //TODO handle error
            return;
        }

        const embed = InitEmbed.construct(tracker);
        //TODO try catch to catch potential errors
        
        let buttonRow;
        let tag;
        if (tracker.phase == InitPhase.ROLL && tracker.rolledCount() < 2)
        {
            buttonRow = ButtonRow.rollPhaseOne;
        }
        else if (tracker.phase == InitPhase.ROLL)
        {
            buttonRow = ButtonRow.rollPhaseTwo;
        }
        else if (tracker.phase == InitPhase.REVEAL)
        {
            buttonRow = ButtonRow.revealPhase;
        }
        else if (tracker.phase >= InitPhase.DECLARE)
        {
            let nextChar = null;
            tag = null;
            tracker.characters.sort(sortInitDescending); 
            // Sorts members in reverse order of Initiative

            for (const character of tracker.characters.values())
            {
                if (character.rolled && !character.declared)
                {
                    nextChar = character;
                    tag = `<@${nextChar.memberId}>`
                    break;
                }
            }

            if (!nextChar) buttonRow = ButtonRow.declarePhaseTwo;
            else buttonRow = ButtonRow.declarePhaseOne;
        }
        
        const ret = {content: tag, embeds: [embed], components: [buttonRow]};
        let message;    
        const oldMessageId = tracker.messageId.toString();
        try
        {
            message = await channel.send(ret);
        }
        catch(error)
        {
            console.error("\n\nFailed to send Init newTracker");
            console.error(error);
            return;
        }

        try {await InitAPI.setMessageId(interaction, message.id)}
        catch(error)
        {
            if (error instanceof DatabaseAccessError)
            {                
                await message.delete();
                await interaction.editReply(ErrorEmbed.DBACCESS);
                return;
            }
            console.error("\n\nError at Initiative.repost(): API send");
            console.error(error);
            return;
        }

        try
        {
            let oldMessage = await channel.messages.fetch(oldMessageId);
            await oldMessage.delete()
        }
        catch(error){} // Do nothing if message doesn't exist

        interaction.editReply("Ready to go!");
    }

    static async endInitiative(interaction)
    {
        try {await InitAPI.setPhase(interaction, undefined, InitPhase.END)}
        catch(error) 
        {
            if (error instanceof DatabaseAccessError)
            {   
                await interaction.followUp(ErrorEmbed.DBACCESS);
                return;
            }            
        }

        await interaction.message.delete();
        await interaction.editReply({content: "Initiative Ended!"});
    }
}

class ErrorEmbed
{
    static thumbnail = "https://cdn.discordapp.com/attachments/" +
        "817275006311989268/974198094696689744/error.png";

    static link = "[RoD Server](https://discord.gg/Qrty3qKv95)";
    static banner = "https://cdn.discordapp.com/attachments/" +
        "699082447278702655/972058320611459102/banner.png";

    static colour = "#db0f20";
    
    static DBACCESS =  
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Database Access Error")
                .setDescription("There was an error accessing the Database and" +
                    " the command could not be completed." +
                    "\nIf the error persists please report it at the " +
                    `${this.link}.`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    };

    static NOGUILD = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Direct Message Error")
                .setDescription("This command can only be used in a server" +
                    `\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static NO_CHANNEL = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No channel Found Error")
                .setDescription("If you see this error, please report it at" +
                    ` ${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static NO_CHAR = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No Character Found Error")
                .setDescription("No character found with the name you specified." +
                    `\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static NOT_TEXT = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Wrong channel type Error")
                .setDescription("This command can only be used in a text channel." +
                    `\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static VIEW_CHANNEL_PERMISSION = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("View Channel Permission Error")
                .setDescription('This command requires the "View Channel"' +
                    ` permission for this channel.\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static SEND_MESSAGE_PERMISSION = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Send Message Permission Error")
                .setDescription(`This command requires the "Send Messages"` +
                    ` permission for this channel.\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static EMBED_LINKS_PERMISSION = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Embed Links Permission Error")
                .setDescription(`This command requires the "Embed Links"` +
                    ` permission for this channel.\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static NOTRACKER = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("No Tracker Found!")
                .setDescription("Please use the `/init new` command to create" +
                    ` a new tracker before this can be used.\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static INVALID_PHASE = 
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Invalid Command Error")
                .setDescription("Please use the `/init new` command to create" +
                    ` a new tracker. Otherwise please wait until the` +
                    ` Tracker asks you to use this command.\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }

    static INVALID_TURN =
    {
        content: undefined,
        embeds: [
            new MessageEmbed()
                .setTitle("Invalid Turn")
                .setDescription("It is not currently your turn " +
                    "to use this command. Please wait until it is." +
                    `\n${this.link}`)
                .setThumbnail(this.thumbnail)
                .setColor(this.colour)
                .setURL(this.banner)
        ],
        components: [],
        ephemeral: true
    }
}

class InitEmbed
{
    static getPhaseInfo = (phase, tracker) => {
        let round = "";
        if (tracker.currentRound > 1) round = `Turn: ${tracker.currentRound} |`;

        switch (phase)
        {
            case InitPhase.NEW:
            case InitPhase.ROLL:                
                return {
                    title: `${round} Roll for Initiative!`,
                    description: "Please use the `/init roll` command " +
                    "to roll for Initiative.\nWhen everone has rolled, press the" +
                    " (Reveal Initiative) button" +
                    "\n----------------------------------",
                    colour: "#c41d71"
                }
            case InitPhase.REVEAL:
                return {
                    title: `${round} Initiative Order!`,
                    description: "----------------------------------",
                    colour: "#c41d71"
                }
            case InitPhase.DECLARE:
                return {
                    title: `${round} Declare Actions!`,
                    description: "Please use the `/init declare` command " +
                    "to declare your actions.\nActions are declared in" +
                    " descending order of Initiative. You can only declare" +
                    " on your turn!\n----------------------------------",
                    colour: "#c41d71"
                }
            case InitPhase.DECLARED:
                return {
                    title: `${round} Take your actions!!`,
                    description: "Actions are taken in order of " +
                    "Initiative.\nWhen all actions have been taken" +
                    " click the (Next Round) button to move into another" +
                    " round or (End Initiative) if you are finished combat" +
                    "\n----------------------------------",
                    colour: "#96150c"
                }
        }
    }

    /**
     * Builds an embed based on the current Phase and members
     * @param {InitTracker} tracker 
     * @returns {MessageEmbed}
     */
    static construct(tracker)
    {
        const phaseInfo = InitEmbed.getPhaseInfo(tracker.phase, tracker);
        const embed = new MessageEmbed()
            .setTitle(phaseInfo.title)
            .setColor(phaseInfo.colour)
            .setDescription(phaseInfo.description);

        if (tracker.phase === InitPhase.ROLL)
        {
            tracker.characters.forEach((character) =>{
                if (!character.rolled) return;
                embed.addField(`${character.name} `+
                    `(${character.member.displayName})`, 
                    "Ready! ✅");
            });
        }
        else if (tracker.phase === InitPhase.REVEAL)
        {
            let count = 1;            
            tracker.characters.sort(sortInitAscending); 
            // Sorts members in order of Initiative

            tracker.characters.forEach((character) => {
                if (!character.rolled) return;
                const d10 = character.init - (character.pool + character.mod);
                let mod = "";
                if (character.mod) mod = `Modifier(${character.mod})`;
                embed.addField(`#${count} - ${character.name} `+
                    `(${character.member.displayName})`, 
                    `||Dex+Wits(${character.pool}) ${mod} 1d10(${d10})||` +
                    `\nInitiative of: ${character.init}`);
                count++;
            });
        }
        else if (tracker.phase >= InitPhase.DECLARE)
        {
            const fields = [];
            let current = false;
            tracker.characters.forEach((character) => {
                if (!character.rolled) return;
                // Go through and set each member and their action
                let value = "";
                if (character.declared) value = character.action;
                else if (!character.declared && !current)
                {
                    value = "📍 Please decalare your action!";
                    current = true;
                }
                else value = "Undeclared";

                fields.unshift({title: `${character.name} `+
                    `(${character.member.displayName})`,
                    value: value});
            });

            for(const field of fields)
            {
                embed.addField(field.title, field.value);
            }
        }

        return embed;
    }
}