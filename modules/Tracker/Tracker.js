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
        this.findHistory = false;
        
        if (message.member)
        {
            this.guild = message.member.guild.id;
            this.admin = message.member.hasPermission("ADMINISTRATOR");

            let db = new Database();
            db.open('Permissions', 'Database');
            let roles = db.find(this.guild);

            if (roles != undefined && roles != null)
            {
                for (let role of Object.values(roles))
                {
                    let key = role.match(/\d+/)[0];
                    if (message.member.roles.cache.has(key)) this.ST = true;
                }
            }
        }
        else this.guild = message.author.id;      
    }

    findCharacter()
    {
        this.db.open('Tracker', 'Database');
        this.dbGuild = this.db.find(this.guild);

        let char;
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

        // Finding Key Value pairs
        let keyValues = content.match(/\w+\s*=\s*(\+|-)?\s*\w+/ig);
        content = content.replace(/\w+\s*=\s*(\+|-)?\s*\w+/ig, '');

        // Finding Args
        if (this.mode == mode.find && content.match(/--history(\s+|$)/i))
        {
            content = content.replace(/--history(\s+)?/i, '');
            this.findHistory = true;
        }

        this.notes = content.match(/\S+(\s+\S+)*/);

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

        this.dbGuild[this.character.name.toLowerCase()] = undefined;
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