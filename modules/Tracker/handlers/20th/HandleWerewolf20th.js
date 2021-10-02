'use strict';
const Werewolf = require('../../characters/Werewolf20th.js');
const isArgsValid = require('../../util/isArgsValid.js');
const handleError = require('../../util/handleError.js');
const { character20thEmbed } = require('../../embed/character20thEmbed.js');
const DatabaseAPI = require("../../../util/DatabaseAPI");

const SPLAT = 'werewolf';
const VERSION = '20th'

module.exports = class HandleVampire20th
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.splat = SPLAT;

        this.args = {
            name: interaction.options.getString('name'),
            willpower: interaction.options.getInteger('willpower'),
            rage: interaction.options.getInteger('rage'),
            gnosis: interaction.options.getInteger('gnosis'),
            exp: interaction.options.getInteger('exp'),
            health: interaction.options.getInteger('health'),
            bashing: interaction.options.getInteger('bashing_damage'),
            lethal: interaction.options.getInteger('lethal_damage'),
            agg: interaction.options.getInteger('agg_damage'),
            notes: interaction.options.getString('notes'),
            nameChange: interaction.options.getString('name_change'),
            thumbnail: interaction.options.getString('image'),
            colour: interaction.options.getString('colour'),
        }
        this.character;
    }

    static getCommand()
    {
        return SPLAT;
    }

    newCharacter()
    {
        const char = new Werewolf(this.interaction);
        char.setName(this.args.name);
        setFields(this.args, char);
        char.updateHistory(this.args, this.notes, "New");

        this.character = char;
        return char;
    }

    async updateCharacter()
    {
        const char = await DatabaseAPI.getCharacter(
            this.args.name, 
            this.interaction.user.id,
            undefined,
            (SPLAT+VERSION)
        );
        if (char === 'noChar')
        {
            handleError(this.interaction, 'noChar', this);
            return undefined;
        }
        else if (!char)
        {
            handleError(this.interaction, 'dbError');
            return undefined;
        }

        updateFields(this.args, char);
        char.updateHistory(this.args, this.notes, "update");

        this.character = char;
        return char;
    }

    async setCharacter()
    {
        const char = await DatabaseAPI.getCharacter(
            this.args.name, 
            this.interaction,
            undefined,
            (SPLAT+VERSION)
        );
        if (char === 'noChar')
        {
            handleError(this.interaction, 'noChar');
            return undefined;
        }
        else if (!char)
        {
            handleError(this.interaction, 'dbError');
            return undefined;
        }

        setFields(this.args, char);
        char.updateHistory(this.args, this.notes, "Set");

        this.character = char;
        return char;
    }

    constructEmbed()
    {
        this.response = 
            character20thEmbed(this.character, this.interaction.client, this.args);
        return this.response;
    }

    async reply()
    {
        try
        {
            await this.interaction.reply(this.response);
        }
        catch (error)
        {
            if (error.code != 50035)
            {
                console.error("Error at Werewolf20th Handler Reply");
                console.error(error);
                handleError(this.interaction, 'handlerReply');
            }
            else handleError(this.interaction, 'malformedURL');         
            return false;
        }
        return true;
    }
}

function setFields(args, char)
{    
    if (args.willpower != null) 
        char.willpower.setTotal(args.willpower);
    if (args.blood != null) char.blood.setTotal(args.blood);
    if (args.morality != null) char.morality.pool.setCurrent(args.morality);
    if (args.moralityType != null) char.morality.name = args.moralityType;

    if (args.health != null) char.health.setTotal(args.health);
    if (args.bashing != null) char.health.setBashing(args.bashing);
    if (args.lethal != null) char.health.setLethal(args.lethal);
    if (args.agg != null) char.health.setAgg(args.agg);
    if (args.exp != null) char.exp.setTotal(args.exp);

    if (args.colour != null) char.colour = args.colour;
    if (args.thumbnail != null && args.thumbnail === 'none')
        char.thumbnail = null;
    else if (args.thumbnail != null)
        char.thumbnail = args.thumbnail;
}

function updateFields(args, char)
{
    if (args.willpower != null) 
        char.willpower.updateCurrent(args.willpower);        
    if (args.blood != null) char.blood.updateCurrent(args.blood);
    if (args.morality != undefined) 
        char.morality.pool.updateCurrent(args.morality);

    if (args.health != null) char.health.updateTotal(args.health);
    if (args.bashing != null) char.health.updateBashing(args.bashing);
    if (args.lethal != null) char.health.updateLethal(args.lethal);
    if (args.agg != null) char.health.updateAgg(args.agg);

    if (args.exp && args.exp < 0) char.exp.updateCurrent(args.exp);
    else if (args.exp != null) char.exp.incTotal(args.exp);
}