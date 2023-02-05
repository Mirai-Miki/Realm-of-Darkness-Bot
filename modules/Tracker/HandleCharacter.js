'use strict';
const { getCharacterClass } = require('../getCharacterClass')
const handleError = require('./util/handleError.js');
const { character20thEmbed } = require('./embed/character20thEmbed.js');
const { character5thEmbed } = require('./embed/character5thEmbed');
const DatabaseAPI = require("../../databaseAPI/DatabaseAPI");
const { Versions } = require('../util/Constants');
const sendToTrackerChannel = require('./util/sendToTrackerChan');

module.exports = class HandleCharacter
{
    constructor(interaction, splat, version)
    {
        this.interaction = interaction;
        this.splat = splat;
        this.version = version;
        this.character;

        this.args = {
            player: interaction.options.getUser('player'),
            name: interaction.options.getString('name'),
            exp: interaction.options.getInteger('exp'),                      
            notes: interaction.options.getString('notes'),
            nameChange: interaction.options.getString('change_name'),
            thumbnail: interaction.options.getString('image'),
            colour: interaction.options.getString('colour'),
            // Used for both v20 and v5 but in differant ways
            willpower: interaction.options.getInteger('willpower'),            
            health: interaction.options.getInteger('health'),  
            // 20th Anniversary Edition
            bashing: interaction.options.getInteger('bashing_damage'),
            lethal: interaction.options.getInteger('lethal_damage'),
            agg: interaction.options.getInteger('agg_damage'),
            // VTM 20th. Humans, Ghouls and Vamps
            blood: interaction.options.getInteger('blood'),
            moralityName: interaction.options.getString('morality_name'),
            morality: interaction.options.getInteger('morality'),
            humanity: interaction.options.getInteger('humanity'),             
            vitae: interaction.options.getInteger('vitae'),
            // Changeling 20th
            glamour: interaction.options.getInteger('glamour'),
            banality: interaction.options.getInteger('banality'),
            nightmare: interaction.options.getInteger('nightmare'),
            imbalance: interaction.options.getInteger('imbalance'),
            healthChimerical: interaction.options.getInteger('health_chimerical'),
            bashingChimerical: interaction.options.getInteger('bashing_chimerical'),
            lethalChimerical: interaction.options.getInteger('lethal_chimerical'),
            aggChimerical: interaction.options.getInteger('agg_chimerical'),
            // Werewolf 20th
            rage: interaction.options.getInteger('rage'),
            gnosis: interaction.options.getInteger('gnosis'),
            // Mage 20th
            arete: interaction.options.getInteger('arete'),
            quintessence: interaction.options.getInteger('quintessence'),
            paradox: interaction.options.getInteger('paradox'),
            // Wraith 20th
            corpus: interaction.options.getInteger('corpus'),
            pathos: interaction.options.getInteger('pathos'),
            // Demon TF
            faith: interaction.options.getInteger('faith'),
            torment: interaction.options.getInteger('torment'),
            // 5th edition
            willpowerSup: interaction.options.getInteger('willpower_superficial'),
            willpowerAgg: interaction.options.getInteger('willpower_agg'),
            healthSup: interaction.options.getInteger('health_superficial'),
            healthAgg: interaction.options.getInteger('health_agg'),            
            // Vampire 5th and Morths 5th
            hunger: interaction.options.getInteger('hunger'),
            humanity: interaction.options.getInteger('humanity'),
            stains: interaction.options.getInteger('stains'),
            // Hunter 5th
            desperation: interaction.options.getInteger('desperation'),
            danger: interaction.options.getInteger('danger'),
            despair: interaction.options.getBoolean('despair'),
        }
    }

    async newCharacter()
    {
        const Character = getCharacterClass(this.splat + this.version);
        const char = new Character(this.interaction);
        await char.build();
        char.setName(this.args.name);
        setFields(this.args, char);
        char.updateHistory(this.args, "New");

        this.character = char;
        return char;
    }

    async updateCharacter()
    {
        let requestedUserId = this.interaction.user.id;

        // Checks if an Admin or ST is trying to update another players char
        if (this.args.player)
        {
            if (!this.interaction.guild)
            {
                handleError(this.interaction, 'noGuild', this);
                return undefined;
            }

            const member = this.interaction.member;
            const roles = await DatabaseAPI.getSTRoles(this.interaction.guild.id);

            if (roles === undefined)
            {
                await handleError(this.interaction, 'dbError', this);
                return undefined;
            }
            else if (member && (!member.permissions.has("ADMINISTRATOR") && 
                !member.roles.cache.hasAny(...roles)))
            {
                await handleError(this.interaction, 'missingPerm', this);
                return undefined;
            }
            
            requestedUserId = this.args.player.id;
        }

        const char = await DatabaseAPI.getCharacter(
            this.args.name, 
            requestedUserId,
            undefined,
            (this.splat + this.version)
        );
        if (char === 'noChar')
        {
            await handleError(this.interaction, 'noChar', this);
            return undefined;
        }
        else if (!char)
        {
            await handleError(this.interaction, 'dbError', this);
            return undefined;
        }

        updateFields(this.args, char);
        char.updateHistory(this.args, "update");

        this.character = char;
        return char;
    }

    async setCharacter()
    {
        const char = await DatabaseAPI.getCharacter(
            this.args.name, 
            this.interaction.user.id,
            undefined,
            (this.splat + this.version)
        );
        if (char === 'noChar')
        {
            await handleError(this.interaction, 'noChar', this);
            return undefined;
        }
        else if (!char)
        {
            await handleError(this.interaction, 'dbError', this);
            return undefined;
        }

        setFields(this.args, char);
        char.updateHistory(this.args, "Set");

        this.character = char;
        return char;
    }

    constructEmbed()
    {
        if (this.version === Versions.v5)
        {
            this.response = character5thEmbed(
                this.character, 
                this.interaction.client,
                this.args.notes
            );
        }
        else
        {
            this.response = character20thEmbed(
                this.character, 
                this.interaction.client, 
                this.args.notes
            );
        }
        
        return this.response;
    }

    async reply()
    {        
        const parsedArgs = [];
        const history = this.character.history[0];
        let content = `Command: ${history.mode} { `;
        const args = history.args;

        for (const key of Object.keys(args))
        {
            const value = args[key];

            parsedArgs.push(`${key}: ${value}`);
        }
        
        content += (parsedArgs.join(', ') + ' }');
        if (history.notes) content += ` ${history.notes}`;

        sendToTrackerChannel(this.response, content, 
            this.character.guild.id, this.interaction.client);
        try
        {
            await this.interaction.editReply(this.response);
        }
        catch (error)
        {
            if (error.code != 50035)
            {
                console.error("Error at Handler Reply");
                console.error(error);
                await handleError(this.interaction, 'handlerReply', this);
            }
            else await handleError(this.interaction, 'malformedURL', this);         
            return false;
        }
        return true;
    }

    async cleanup()
    {
        this.interaction = undefined;
        this.response = undefined;
        this.character = undefined;
        this.version = undefined;
        this.splat = undefined;
    }
}

function setFields(args, char)
{
    if (args.nameChange != null) char.setName(args.nameChange);  
    if (args.exp != null) char.exp.setTotal(args.exp);
    if (args.colour != null) char.colour = args.colour;
    if (args.thumbnail === 'none')
        char.thumbnail = null;
    else if (args.thumbnail != null)
        char.thumbnail = args.thumbnail;
    // Character Specific Args   
    // Used for both v20 and v5 but in differant ways
    if (args.willpower != null) char.willpower.setTotal(args.willpower);
    if (args.health != null) char.health.setTotal(args.health);
    // 20th Anniversary Edition
    if (args.bashing != null) char.health.setBashing(args.bashing);
    if (args.lethal != null) char.health.setLethal(args.lethal);
    if (args.agg != null) char.health.setAgg(args.agg);
    // VTM 20th. Humans, Ghouls and Vampirs
    if (args.blood != null && char.splat == 'Vampire') 
        char.blood.setTotal(args.blood);
    else if (args.blood != null) char.blood.setCurrent(args.blood);
    if (args.morality != null) char.morality.pool.setCurrent(args.morality);
    if (args.moralityName != null) char.morality.name = args.moralityName;
    if (args.vitae != null) char.vitae.setCurrent(args.vitae);
    // Werewolf 20th
    if (args.rage != null) char.rage.setTotal(args.rage);
    if (args.gnosis != null) char.gnosis.setTotal(args.gnosis);
    // changeling 20th
    if (args.glamour != null) char.glamour.setTotal(args.glamour);
    if (args.banality != null) char.banality.setPermanant(args.banality);
    if (args.nightmare != null) char.nightmare.setTemporary(args.nightmare);
    if (args.imbalance != null) char.nightmare.setPermanant(args.imbalance);
    if (args.healthChimerical != null) 
        char.chimericalHealth.setTotal(args.healthChimerical);
    if (args.bashingChimerical != null) 
        char.chimericalHealth.setBashing(args.bashingChimerical);
    if (args.lethalChimerical != null) 
        char.chimericalHealth.setLethal(args.lethalChimerical);
    if (args.aggChimerical != null) 
        char.chimericalHealth.setAgg(args.aggChimerical);
    // Mage 20th
    if (args.arete != null) char.arete.setCurrent(args.arete);
    if (args.paradox != null) char.setParadox(args.paradox);
    if (args.quintessence != null) char.setQuint(args.quintessence);    
    // Wraith 20th
    if (args.corpus != null) char.corpus.setTotal(args.corpus);
    if (args.pathos != null) char.pathos.setCurrent(args.pathos);
    // Demon TF
    if (args.faith != null) char.faith.setTotal(args.faith);
    if (args.torment != null) char.torment.setPermanant(args.torment);
    // 5th edition
    if (args.willpowerSup != null) char.willpower.setSuperfical(args.willpowerSup);
    if (args.willpowerAgg != null) char.willpower.setAgg(args.willpowerAgg);
    if (args.healthSup != null) char.health.setSuperfical(args.healthSup);
    if (args.healthAgg != null) char.health.setAgg(args.healthAgg);
    // Vampire 5th and Morths 5th
    if (args.hunger != null) char.hunger.setCurrent(args.hunger);
    if (args.humanity != null) char.humanity.setCurrent(args.humanity);
    if (args.stains != null) char.humanity.setStains(args.stains);
    // Hunter 5th
    if (args.desperation != null) char.desperation.setCurrent(args.desperation);
    if (args.danger != null) char.danger.setCurrent(args.danger);
    if (args.despair != null) char.despair = args.despair;
}

function updateFields(args, char)
{
    if (args.exp && args.exp < 0) char.exp.updateCurrent(args.exp);
    else if (args.exp != null) char.exp.incTotal(args.exp);
    // Character Specific Args
    // Used for both v20 and v5 but in differant ways
    if (args.willpower != null) char.willpower.updateCurrent(args.willpower);  
    if (args.health != null) char.health.updateCurrent(args.health);
    // 20th Anniversary Edition
    if (args.bashing != null) char.health.updateBashing(args.bashing);
    if (args.lethal != null) char.health.updateLethal(args.lethal);
    if (args.agg != null) char.health.updateAgg(args.agg);
    // VTM 20th. Humans, Ghouls and Vampirs
    if (args.blood != null) 
        char.blood.updateCurrent(args.blood);
    if (args.morality != null) char.morality.pool.updateCurrent(args.morality);
    if (args.vitae != null) char.vitae.updateCurrent(args.vitae);
    // Werewolf 20th
    if (args.rage != null) char.rage.updateCurrent(args.rage);
    if (args.gnosis != null) char.gnosis.updateCurrent(args.gnosis);
    // Changeling 20th
    if (args.glamour != null) char.glamour.updateCurrent(args.glamour);
    if (args.banality != null) char.banality.updateTemporary(args.banality);
    if (args.nightmare != null) char.nightmare.updateTemporary(args.nightmare);
    if (args.imbalance != null) char.nightmare.updatePermanant(args.imbalance);
    if (args.healthChimerical != null) 
        char.chimericalHealth.updateCurrent(args.healthChimerical);
    if (args.bashingChimerical != null) 
        char.chimericalHealth.updateBashing(args.bashingChimerical);
    if (args.lethalChimerical != null) 
        char.chimericalHealth.updateLethal(args.lethalChimerical);
    if (args.aggChimerical != null) 
        char.chimericalHealth.updateAgg(args.aggChimerical);
    // Mage 20th
    if (args.arete != null) char.arete.updateCurrent(args.arete);
    if (args.quintessence != null) char.updateQuint(args.quintessence);
    if (args.paradox != null) char.updateParadox(args.paradox);
    // Wraith 20th
    if (args.corpus != null) char.corpus.updateCurrent(args.corpus);
    if (args.pathos != null) char.pathos.updateCurrent(args.pathos);
    // Demon TF
    if (args.faith != null) char.faith.updateCurrent(args.faith);
    if (args.torment != null) char.torment.updateTemporary(args.torment);
    // 5th edition
    if (args.willpowerSup != null) char.willpower.takeSuperfical(args.willpowerSup);
    if (args.willpowerAgg != null) char.willpower.takeAgg(args.willpowerAgg);
    if (args.healthSup != null) char.health.takeSuperfical(args.healthSup);
    if (args.healthAgg != null) char.health.takeAgg(args.healthAgg);
    // Vampire 5th and Morths 5th
    if (args.hunger != null) char.hunger.updateCurrent(args.hunger);
    if (args.humanity != null) char.humanity.updateCurrent(args.humanity);
    if (args.stains != null) char.humanity.takeStains(args.stains);
    // Hunter 5th
    if (args.desperation != null) char.desperation.updateCurrent(args.desperation);
    if (args.danger != null) char.danger.updateCurrent(args.danger);
    if (args.despair != null) char.despair = args.despair;
}