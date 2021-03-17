const fs = require("fs");
const Database = require('../util/Database.js');
const mode = require('./TypeDef/mode.js');
const errorType = require('./TypeDef/errors.js');
const Discord = require('discord.js');
const { getErrorMessage } = require('./getErrorMessage.js');
const universalKeys = require('./keys/universal.js');

handlers = new Discord.Collection();

const handlersFiles = fs.readdirSync('./modules/Tracker/handlers/')
    .filter(file => file.endsWith('.js'))
for (const file of handlersFiles) 
{
    const handler = require(`./handlers/${file}`);
    handlers.set(handler.name, handler);
}

module.exports = class Tracker 
{
    constructor(message) 
    {
        this.recvMess = message;
        this.name;
        this.keys = new Map();
        this.mode;
        this.guild;
        this.character;
        this.admin = false;
        this.ST = false;   
        this.db = new Database();
        this.dbGuild;          
        this.error;
        this.embed;
        this.notes;
        
        if (message.member)
        {
            this.guild = message.member.guild.id;
            this.admin = message.member.hasPermission("ADMINISTRATOR");

            let db = new Database();
            db.open('Permissions', 'Database');
            let roles = db.find(this.guild);

            for (let role of Object.values(roles))
            {
                let key = role.match(/\d+/)[0];
                if (message.member.roles.cache.has(key)) this.ST = true;
            }
        }
        else this.guild = message.author.id;      
    }

    findCharacter()
    {
        this.db.open('Tracker', 'Database');
        this.dbGuild = this.db.find(this.guild);

        let char
        if (this.dbGuild) char = this.dbGuild[this.name.toLowerCase()];
        
        if (char) this.character = char;
    }

    setMode(mode)
    {
        this.mode = mode;
    }

    parseCharacter(content)
    {
        //TODO implement multi word names
        let name = content.match(/^\s*\w+\s*/i)[0];
        this.name = name.replace(/\s+/g, '');
        content = content.replace(name, '');

        let keyValues = content.match(/\w+\s*=\s*(\+|-)?\s*\w+/ig);
        content = content.replace(/\w+\s*=\s*(\+|-)?\s*\w+/ig, '');
        this.notes = content.match(/\w+(\s+\w+)*/);

        if (this.notes) this.notes = this.notes[0];
        
        if (!keyValues && this.mode <= mode.set)
        {
            this.error = errorType.noKey;
            return;
        }
        else if (!keyValues)
        {
            this.findCharacter();
            return;
        }

        for (let keyValue of keyValues)
        {
            let key = keyValue.match(/(\+|-)?\w+/ig)

            if (key)
            {
                if (this.keys.has(key[0]))
                {
                    this.error = errorType.dupKey;
                }
                this.keys.set(key[0].toLowerCase(), key[1].toLowerCase());
            }
        }
        this.findCharacter(); 
    }

    newCharacter()
    {
        if (this.character) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(errorType.dupChar)}`;
        
        let version;
        let splat;
        this.keys.forEach((value, key, map) => 
        {
            if (universalKeys.versionKey.keys.includes(key))
            {
                if (version) this.error = errorType.dupKey;
                version = value;
                this.keys.delete(key);
            }
            else if (universalKeys.splatKey.keys.includes(key))
            {
                if (splat) this.error = errorType.dupKey;
                splat = value;
                this.keys.delete(key);
            }
        });
        
        if (!this.error && !version) this.error = errorType.missingVer;
        if (!this.error && !splat) this.error = errorType.missingSplat;        
        if (this.error) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(this.error)}`;

        return this.handle(version, splat);
    }

    existingCharacter()
    {
        if (!this.character) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(errorType.noChar)}`;

        if (this.character.owner != this.recvMess.author.id &&
            !this.admin && !this.ST)
        {
            return `<@${this.recvMess.author.id}> ` +
                `${getErrorMessage(errorType.noPerm)}`;
        }
        
        return this.handle(this.character.version, this.character.splat);
    }

    find()
    {
        if (!this.character) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(errorType.noChar)}`;

        if (this.character.owner != this.recvMess.author.id &&
            !this.admin && !this.ST)
        {
            return `<@${this.recvMess.author.id}> ` +
                `${getErrorMessage(errorType.noPerm)}`;
        }

        return this.handle(this.character.version, this.character.splat);
    }

    deleteCharacter()
    {
        if (!this.character) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(errorType.noChar)}`;

        if (this.character.owner != this.recvMess.author.id &&
            !this.admin && !this.ST)
        {
            return `<@${this.recvMess.author.id}> ` +
                `${getErrorMessage(errorType.noPerm)}`;
        }

        this.dbGuild[this.character.name] = undefined;
        this.db.add(this.guild, this.dbGuild);
        this.db.close();
        return `<@${this.recvMess.author.id}> Deleted ${this.character.name}`;
    }

///////////////////////// TODO /////////////////////
// Mode: Character shifting
// Strip non shared keys
// send Striped Char to new handler
// Handler adds any non shared keys
// Return shifted character
// Most useful for mortal/ghoul to Vampire

    handle(version, splat)
    {
        const handler = handlers.find(
            hdr => hdr.getKeys().version && hdr.getKeys().version.options && 
                hdr.getKeys().version.options.includes(version.toLowerCase()) &&
                hdr.getKeys().splat && hdr.getKeys().splat.options &&
                hdr.getKeys().splat.options.includes(splat.toLowerCase()));
                
        if (!handler) return `<@${this.recvMess.author.id}> ` +
            `${getErrorMessage(errorType.incorrectSplatOrVer)}`;
        
        try 
        {
            return handler.handle(this);
        } catch (error) {
            console.error(error);
            this.error = 1;
            return `<@${this.recvMess.author.id}> ` +
                `${getErrorMessage(errorType.handle)}`;
        }
    }
}

/*
Commands
/new <name> <keys>
used for creating a new character. "consumable" keys change the max value
/update <name> <keys>
used for changing values
/set <name> <keys>
used for changing "consumable" max values
/delete <name>
used for deleting a characte

Key

Universal <Required for a new Character>
version: 'v', 'version'
splat: 'type', 'splat', 't', 's


V5: '5', 'v5', '5th'
willpower: 'w', 'willpower', 'wp'
health: 'd', 'health', 'damage' 
superficialWillpower: 'sw', 'superwillpower', 'superficialwillpower', 'swp'
aggWillpower: 'aw', 'aggw', 'aggwp', 'aggwillpower', 'aggravatedwillpower'
superficialHealth: 'sw', 'superwillpower', 'superficialwillpower', 'swp'
aggHealth: 'ad', 'ah', 'aggh', 'aggdamage', 'agghealth

Vamp 'v', 'vamp', 'vampire'      
hunger: 'h', 'hunger'
humanity: 'hm', 'humanity'

Human 'h', 'human'
humanity: 'hm', 'humanity


V20: '20', 'v20', '20th'
willpower(consumable): 'w', 'willpower', 'wp'
bashing: 'bash', 'bashing'
lethal: 'l', 'lethal'
aggravated: 'agg', 'aggravated

Vamp 'v', 'vamp', 'vampire'
blood(consumable): 'b', 'blood'
humanity: 'h', 'hm', 'humanity

Human 'h', 'human'
blood: 'b', 'blood'
humanity: 'h', 'hm', 'humanity

Ghoul 'g', 'ghoul'
blood: 'b', 'blood'
humanity: 'h', 'hm', 'humanity'
vitea: 'v', 'vitea

Werewolf 'w', 'wolf', 'garou' 'werewolf'
Rage(consumable): 'r', 'rage'
gnosis(consumable): 'g', 'gnosis

Changeling 'c', 'changeling'
glamour(consumable): 'g', 'glamour'
banality(consumable): 'b', 'bane', 'banality'
chimericalbashing: 'cbash', 'cbashing'
chimericallethal: 'cl', 'clethal'
chimericalaggravated: 'cagg', 'caggravated

Mage 'm', 'mage'
arete: 'a', 'arete'
quintessence: 'q', 'quint', 'quintessence'
paradox: 'p', 'paradox

Wraith 'wr', 'wraith'
corpus(consumable): 'c', 'corpus'
pathos: 'p', 'pathos


Note about consumables
To set the Total Value rather then the current value you need to use
the set command rather then the update command
if i didn't do it that way i would need total value keys as well for 
every consumable
*/