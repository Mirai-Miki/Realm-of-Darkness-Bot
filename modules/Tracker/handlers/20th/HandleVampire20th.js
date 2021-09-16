'use strict';
const Vampire = require('../../characters/Vampire20th.js');
const isArgsValid = require('../../util/isArgsValid.js');
const { character20thEmbed } = require('../../embed/character20thEmbed.js');
const { getCharacter } = require('../../util/util.js');

module.exports = class HandleVampire20th
{
    constructor(interaction)
    {
        this.interaction = interaction;

        this.args = {
            name: interaction.options.getString('name'),
            willpower: interaction.options.getInteger('willpower'),
            blood: interaction.options.getInteger('blood'),
            moralityType: interaction.options.getString('morality_type'),
            morality: interaction.options.getInteger('morality'),
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
        return 'vampire20th';
    }

    isSetArgsValid()
    {
        const response = isArgsValid.set(this.args, this.interaction);         
        
        if (response.content)
        {
            this.interaction.reply(response);
            return false;
        }
        else return true;
    }

    isUpdateArgsValid()
    {
        const response = isArgsValid.update(this.args);        
        
        if (response.content)
        {
            this.interaction.reply(response);
            return false;
        }
        else return true;
    }

    newCharacter()
    {
        if (getCharacter(this.args.name, this.interaction.user.id))
        {
            this.interaction.reply({
                content: "You already have a Character with this name.", 
                ephemeral: true});
            return undefined;
        }

        const char = new Vampire();

        char.setName(this.args.name);
        char.setUser(this.interaction);
        char.setGuild(this.interaction);
        setFields(this.args, char);
        char.updateHistory(this.args, this.notes, "New");

        this.character = char;
        return char;
    }

    updateCharacter()
    {
        const json = getCharacter(this.args.name, this.interaction.user.id);
        if (!json)
        {
            this.interaction.reply({
                content: `Could not find ${this.args.name}.`, 
                ephemeral: true});
            return undefined;
        }
        else if (json.splat != 'Vampire')
        {
            this.interaction.reply({
                content: `This character is not a Vampire 20th.`, 
                ephemeral: true});
            return undefined;
        }
        else if (json.version != 'v20')
        {
            this.interaction.reply({
                content: `This vampire is not a 20th edition Character.`, 
                ephemeral: true});
            return undefined;
        }

        const char = new Vampire();
        char.deserilize(json);

        char.setUser(this.interaction);
        char.setGuild(this.interaction);
        updateFields(this.args, char);
        char.updateHistory(this.args, this.notes, "update");

        this.character = char;
        return char;
    }

    setCharacter()
    {
        const json = getCharacter(this.args.name, this.interaction.user.id);
        if (!json)
        {
            this.interaction.reply({
                content: `Could not find ${this.args.name}.`, 
                ephemeral: true});
            return undefined;
        }
        else if (json.splat != 'Vampire')
        {
            this.interaction.reply({
                content: `This character is not a Vampire 20th.`, 
                ephemeral: true});
            return undefined;
        }
        else if (json.version != 'v20')
        {
            this.interaction.reply({
                content: `This vampire is not a 20th edition Character.`, 
                ephemeral: true});
            return undefined;
        }

        const char = new Vampire();
        char.deserilize(json);

        char.setUser(this.interaction);
        char.setGuild(this.interaction);
        setFields(this.args, char);
        char.updateHistory(this.args, this.notes, "Set");

        this.character = char;
        return char;
    }

    constructEmbed()
    {
        this.response = 
            character20thEmbed(this.character, this.interaction, this.args);
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
                console.error("Error at Vamp20th Handler Reply");
                console.error(error);
            }
            else
            {
                this.interaction.reply({content: 
                    "The URL you sent was Malformed." +
                    " Please enter a valid image URL." +
                    "\nThe easiest way to do this is upload your file to discord and" +
                    " select the copy link option from it.",
                    ephemeral: true});
            }            
            return false;
        }
        return true;
    }

    serialize()
    {
        if (!this.character) return;
        const s = {};

        s['name'] = this.character.name;
        s['user'] = this.character.user;
        s['guild'] = this.character.guild;
        s['splat'] = this.character.splat;
        s['version'] = this.character.version;
        s['colour'] = this.character.colour;
        s['thumbnail'] = this.character.thumbnail;
        s['exp'] = {
            total: this.character.exp.total,
            current: this.character.exp.current,    
        };
        s['history'] = this.character.history;
        s['willpower'] = {
            total: this.character.willpower.total,
            current: this.character.willpower.current,
        };
        s['health'] = {
            total: this.character.health.total,
            bashing: this.character.health.bashing,
            lethal: this.character.health.lethal,
            aggravated: this.character.health.aggravated,
        };
        s['morality'] = {
            name: this.character.morality.name,
            current: this.character.morality.pool.current,
        };
        s['blood'] = {
            total: this.character.blood.total,
            current: this.character.blood.current,
        };

        return s;
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
    if (args.thumbnail != null) char.thumbnail = args.thumbnail;
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