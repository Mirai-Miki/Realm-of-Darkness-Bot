'use strict';
const Axios = require('axios');
const { APIKey } = require('../../config.json');

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
            const response = JSON.parse(res.data.content);
            if (response.status === 'exists')
            {
                return 'exists';
            }
            
            console.log(response);
            return 'saved';
        }
        else
        {
            console.error("Error in DatabaseAPI.saveCharacter()")
            console.error(`Status: ${res.status}`)
            return undefined;
        }
    }

    static async getCharacter()
    {
        // Need to get Character info
        // Send name and userId
        // getCharacter JSON
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