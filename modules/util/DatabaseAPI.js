'use strict';
const Axios = require('axios');
const { APIKey } = require('../../config.json');
const { getCharacterClass } = require('./getCharacterClass');

const config = {headers: {'Content-Type': 'application/json'}};
const IP = 'localhost';
const PORT = '8000';

module.exports = class DatabaseAPI
{
    static async saveCharacter(character)
    {
        const host = `http://${IP}:${PORT}/bot/character/save`;
        const data = character.serialize();
        data['APIKey'] = APIKey;
        
        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            if (response.status === 'exists')
            {
                return 'exists';
            }
            else if (response.status === 'charOverflow')
            {
                return 'charOverflow';
            }
            
            return 'saved';
        }
        else
        {
            console.error("Error in DatabaseAPI.saveCharacter()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async getCharacter(name, userId, interaction=null, splat=null, pk=null)
    {
        const host = `http://${IP}:${PORT}/bot/character/get`;
        const data = {
            APIKey: APIKey, 
            name: name, 
            userId: userId, 
            splat: splat ?? undefined,
            pk: pk ?? undefined
        }
        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            if (!response.status)
            {
                return 'noChar';
            }
            const character = response.character;

            const Character = getCharacterClass(character.splat);
            const char = new Character(interaction);
            char.deserilize(character);
            
            return char;
        }
        else
        {
            console.error("Error in DatabaseAPI.getCharacter()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async getNameList(userId, guildId)
    {
        const host = `http://${IP}:${PORT}/bot/character/name_list`;
        const data = {
            APIKey: APIKey, 
            userId: userId, 
            guildId: guildId
        }
        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            if (response.status == 'noChar')
            {
                return 'noChar';
            }

            return res.data.list;
        }
        else
        {
            console.error("Error in DatabaseAPI.getNameList()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async deleteCharacters(ids)
    {
        const host = `http://${IP}:${PORT}/bot/character/delete`;
        const data = {
            APIKey: APIKey,
            ids: ids
        }
        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async setTrackerChannel(guild, channelId)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/channel/set`;

        const data = {
            APIKey: APIKey,
            guild: {
                id: guild.id,
                member_count: guild.memberCount,
                icon_url: guild.iconURL() ?? '',
            },
            channel_id: channelId,
        }

        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async getTrackerChannel(guildId)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/channel/get`;

        const data = {
            APIKey: APIKey,
            guild_id: guildId
        }

        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data.channel_id;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async setSTRole(guild, roleId)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/storyteller/role/set`;

        const data = {
            APIKey: APIKey,
            guild: {
                id: guild.id,
                member_count: guild.memberCount,
                icon_url: guild.iconURL() ?? '',
            },
            role_id: roleId,
        }

        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async getSTRoles(guildId)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/storyteller/role/get`;

        const data = {
            APIKey: APIKey,
            guild_id: guildId
        }

        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data.roles;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async DeleteSTRole(role)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/storyteller/role/delete`;
        const guild = role.guild;

        const data = {
            APIKey: APIKey,
            guild: {
                id: guild.id,
                member_count: guild.memberCount,
                icon_url: guild.iconURL() ?? '',
            },
            role_id: role.id,
        }

        let res;
        try
        {
            res = await Axios.post(host, data, config);
        }
        catch (error)
        {
            if (error.code === 'ECONNREFUSED')
            {
                console.error("Error Database refused connection.\nCode: " +
                    "ECONNREFUSED")
            }
            else console.error(error);
            return undefined;
        }

        if (res.status == 200 && res.data)
        {
            const response = res.data;
            return response;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }
}