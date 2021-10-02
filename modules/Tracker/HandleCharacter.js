'use strict';
const { getCharacterClass } = require('../util/util')
const handleError = require('./util/handleError.js');
const { character20thEmbed } = require('./embed/character20thEmbed.js');
const DatabaseAPI = require("../util/DatabaseAPI");
const { Splats } = require('../util/Constants');

module.exports = class HandleVampire20th
{
    constructor(interaction, splat)
    {
        this.interaction = interaction;
        this.splat = splat;
        this.character;

        this.args = {
            name: interaction.options.getString('name'),
            exp: interaction.options.getInteger('exp'),                      
            notes: interaction.options.getString('notes'),
            nameChange: interaction.options.getString('name_change'),
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
            blood: interaction.options.getString('blood'),
            moralityName: interaction.options.getString('morality_name'),
            morality: interaction.options.getString('morality'),
            // Cannot have humanity and Morality at the same time.
            morality: interaction.options.getString('humanity'),             
            vitae: interaction.options.getString('vitae'),
            // Changeling 20th
            glamour: interaction.options.getString('glamour'),
            banality: interaction.options.getString('banality'),
            nightmare: interaction.options.getString('nightmare'),
            imbalence: interaction.options.getString('imbalence'),
            healthChimerical: interaction.options.getString('health_chimerical'),
            bashingChimerical: interaction.options.getString('bashing_chimerical'),
            lethalChimerical: interaction.options.getString('lethal_chimerical'),
            aggChimerical: interaction.options.getString('agg_chimerical'),
            // Werewolf 20th
            rage: interaction.options.getString('rage'),
            gnosis: interaction.options.getString('gnosis'),
            // Mage 20th
            arete: interaction.options.getString('arete'),
            quintessence: interaction.options.getString('quintessence'),
            paradox: interaction.options.getString('paradox'),
            // Wraith 20th
            corpus: interaction.options.getString('corpus'),
            pathos: interaction.options.getString('pathos'),
            // Demon TF
            faith: interaction.options.getString('faith'),
            tormentPerm: interaction.options.getString('torment_permanent'),
            tormentTemp: interaction.options.getString('torment_temporary'),
            // 5th edition
            willpowerSup: interaction.options.getInteger('willpower_superficial'),
            willpowerAgg: interaction.options.getInteger('willpower_agg'),
            healthSup: interaction.options.getInteger('health_superficial'),
            healthAgg: interaction.options.getInteger('health_agg'),            
            // Vampire 5th and Morths 5th
            hunger: interaction.options.getInteger('hunger'),
            humanity: interaction.options.getInteger('humanity'),
            stains: interaction.options.getInteger('stains'),
        }
    }

    newCharacter()
    {
        const Character = getCharacterClass(this.splat);
        const char = new Character(this.interaction);
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
            this.splat
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
            this.splat
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
                console.error("Error at Handler Reply");
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
    // Character Specific Args
    // VTM 20th. Humans, Ghouls and Vampirs
    if (keys.blood != null) char.blood.setTotal(keys.blood);
    if (args.morality != null) char.morality.pool.setTotal(args.morality);
    if (args.moralityName != null) char.morality.name = args.moralityName;
    if (keys.vitae != null) char.vitae.setTotal(keys.vitae);
    // Werewolf 20th
    if (keys.rage != null) char.rage.setTotal(keys.rage);
    if (keys.gnosis != null) char.gnosis.setTotal(keys.gnosis);
    // changeling 20th
    if (keys.glamour != null) char.glamour.setTotal(keys.glamour);
    if (keys.banality != null) char.banality.setTotal(keys.banality);
    if (keys.nightmare != null) char.nightmare.setTotal(keys.nightmare);
    if (keys.imbalance != null) char.imbalence.setTotal(keys.imbalance);
    if (args.healthChimerical != null) 
        char.chimericalHealth.setTotal(args.healthChimerical);
    if (keys.bashingChimerical != null) 
        char.chimericalHealth.setBashing(keys.bashingChimerical);
    if (keys.lethalChimerical != null) 
        char.chimericalHealth.setLethal(keys.lethalChimerical);
    if (keys.aggChimerical != null) 
        char.chimericalHealth.setAgg(keys.aggChimerical);
    // Mage 20th
    if (keys.arete != null) char.arete.setTotal(keys.arete);
    if (keys.quintessence != null) char.quintessence.setTotal(keys.quintessence);
    if (keys.paradox != null) char.paradox.setTotal(keys.paradox);
    // Wraith 20th
    if (keys.corpus != null) char.corpus.setTotal(keys.corpus);
    if (keys.pathos != null) char.pathos.setTotal(keys.pathos);
    // Demon TF
    if (keys.faith != null) char.faith.setTotal(keys.faith);
    if (keys.tormentPerm != null) char.tormentPerm.setTotal(keys.tormentPerm);
    if (keys.tormentTemp != null) char.tormentTemp.setTotal(keys.tormentTemp);
}

function updateFields(args, char)
{
    if (args.willpower != null) 
        char.willpower.updateCurrent(args.willpower);  
    if (args.health != null) char.health.updateTotal(args.health);
    if (args.bashing != null) char.health.updateBashing(args.bashing);
    if (args.lethal != null) char.health.updateLethal(args.lethal);
    if (args.agg != null) char.health.updateAgg(args.agg);
    if (args.exp && args.exp < 0) char.exp.updateCurrent(args.exp);
    else if (args.exp != null) char.exp.incTotal(args.exp);
    // Character Specific Args
    // VTM 20th. Humans, Ghouls and Vampirs
    if (keys.blood != null) 
        char.blood.updateCurrent(keys.blood);
    if (args.morality != null) char.morality.pool.updateCurrent(args.morality);
    if (keys.vitae != null) char.vitae.updateCurrent(keys.vitae);
    // Werewolf 20th
    if (keys.rage != null) char.rage.updateCurrent(keys.rage);
    if (keys.gnosis != null) char.gnosis.updateCurrent(keys.gnosis);
    // Changeling 20th
    if (keys.glamour != null) char.glamour.updateCurrent(keys.glamour);
    if (keys.banality != null) char.banality.updateCurrent(keys.banality);
    if (keys.nightmare != null) char.nightmare.updateCurrent(keys.nightmare);
    if (keys.imbalance != null) char.imbalence.updateCurrent(keys.imbalance);
    if (args.healthChimerical != null) 
        char.chimericalHealth.updateTotal(args.healthChimerical);
    if (keys.bashingChimerical != null) 
        char.chimericalHealth.updateBashing(keys.bashingChimerical);
    if (keys.lethalChimerical != null) 
        char.chimericalHealth.updateLethal(keys.lethalChimerical);
    if (keys.aggChimerical != null) 
        char.chimericalHealth.updateAgg(keys.aggChimerical);
    // Mage 20th
    if (keys.arete != null) char.arete.updateCurrent(keys.arete);
    if (keys.quintessence != null)
        char.quintessence.updateCurrent(keys.quintessence);
    if (keys.paradox != null) char.paradox.updateCurrent(keys.paradox);
    // Wraith 20th
    if (keys.corpus != null) char.corpus.updateCurrent(keys.corpus);
    if (keys.pathos != null) char.pathos.updateCurrent(keys.pathos);
    // Demon TF
    if (keys.faith != null) char.faith.updateCurrent(keys.faith);
    if (keys.tormentPerm != null) char.tormentPerm.updateCurrent(keys.tormentPerm);
    if (keys.tormentTemp != null) char.tormentTemp.updateCurrent(keys.tormentTemp);
}