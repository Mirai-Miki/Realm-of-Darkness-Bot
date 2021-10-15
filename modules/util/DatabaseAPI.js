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

    static async setTrackerChannel(channelId, guildId)
    {
        const host = `http://${IP}:${PORT}/bot/chronicle/channel`;
        const data = {
            APIKey: APIKey,
            guild_id: guildId,
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

    static async sendUserInfo()
    {
        // create or update user info.

        /*
        {
            id: string,
            username: string,
            discriminator: string,
            avatarURL: string,
        }
        */
    }

    static async sendGuildInfo()
    {
        // Create or update guild

        /*
        {
            id: string,
            name: string,
            iconURL: string,
        }
        */
    }

    static async sendMemberInfo()
    {
        // Create or update member

        /*
        {
            guildId: string,
            userId: string,
            displayName: string,
        }
        */
    }
}