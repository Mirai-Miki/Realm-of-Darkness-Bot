'use strict';
const Axios = require('axios');
const { APIKey } = require('../../config.json');

const { Collection } = require("discord.js");
const fs = require('fs');

const characters = new Collection();
const charFiles = fs.readdirSync('./modules/Tracker/characters')
    .filter(file => file.endsWith('.js'));

for (const file of charFiles) {
	const char = require(`../Tracker/characters/${file}`);
	characters.set(char.getSplat(), char);
}

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
        console.log(data)
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

    static async getCharacter(name, userId, splat)
    {
        const host = `http://${IP}:${PORT}/bot/character/get`;
        const data = {APIKey: APIKey, name: name, userId: userId, splat: splat}
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

            const Character = characters.get(splat);
            if (!Character) return console.error("No Character Class");
            const char = new Character();
            char.deserilize(character);
            
            console.log(response);
            return char;
        }
        else
        {
            console.error("Error in DatabaseAPI.getCharacter()")
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