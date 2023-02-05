'use strict';
const { APIKey } = require('../config5th.json');
const { postData } = require('./postData.js');


module.exports = class DatabaseAPI
{
    static async getNameList(userId, guildId)
    {
        const host = `${DOMAIN}/bot/character/name_list`;
        const data = {
            APIKey: APIKey, 
            userId: userId, 
            guildId: guildId
        }
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
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
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }

    static async deleteCharacters(ids, disconnect)
    {
        const host = `${DOMAIN}/bot/character/delete`;
        const data = {
            APIKey: APIKey,
            ids: ids,
            disconnect: disconnect
        }

        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }

    static async setTrackerChannel(guild, channelId)
    {
        const host = `${DOMAIN}/bot/chronicle/channel/set`;

        const data = {
            APIKey: APIKey,
            guild: {
                id: guild.id,
                member_count: guild.memberCount,
                icon_url: guild.iconURL() ?? '',
            },
            channel_id: channelId,
        }

        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }

    static async getTrackerChannel(guildId)
    {
        const host = `${DOMAIN}/bot/chronicle/channel/get`;

        const data = {
            APIKey: APIKey,
            guild_id: guildId
        }

        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data.channel_id;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }

    static async setSTRole(guild, roleId)
    {
        const host = `${DOMAIN}/bot/chronicle/storyteller/role/set`;

        const data = {
            APIKey: APIKey,
            guild: {
                id: guild.id,
                member_count: guild.memberCount,
                icon_url: guild.iconURL() ?? '',
            },
            role_id: roleId,
        }

        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }

    static async DeleteSTRole(role)
    {
        const host = `${DOMAIN}/bot/chronicle/storyteller/role/delete`;
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

        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data;
        }
        else
        {
            console.error("Error in DatabaseAPI.deleteCharacters()")
            console.error(`Status: ${res?.status}`)
            return undefined;
        }
    }
}