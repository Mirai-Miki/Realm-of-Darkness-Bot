'use strict';
const { APIKey } = require('../config5th.json');
const { postData } = require('./postData.js');

const IP = 'localhost';
const PORT = '8000';

module.exports.InitAPI = class InitAPI
{
    /*
    Sets the current phase of the tracker
    0: roll_phase (sets all actions to false, updates round marker)
    1: reveal_phase (returns roll data)
    2: declare_phase (returns roll data)
    3: end_phase (removed tracker data)
    Send:
    {
        APIKey: APIKey,
        channelId: string,
        guildId: string,
        messageId: string,
        phase: int
    }
    Recieve:
    {
        status: string
    }
    */
    static async setPhase(interaction, messageId, phase)
    {
        const host = `http://${IP}:${PORT}/bot/init/phase`;
        const data = 
        {
            APIKey: APIKey,
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            guildName: interaction.guild.name,
            messageId: messageId,
            phase: phase
        };
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data.tracker;
        }
        else
        {
            console.error("Error in InitAPI.setPhase()");
            console.error(`Status: ${res?.status}`);
            throw new DatabaseAccessError();
        }
    }

    /*
    Updates roll info for a member
    send:
    {
        APIKey: APIKey,
        channelId: string,
        messageId: string,
        memberId: string,
        name: string,
        pool: int
        init: int
    }
    Recieve:
    {
        status: string
    }
    */
    static async roll(tracker, character)
    {
        const host = `http://${IP}:${PORT}/bot/init/roll`;
        const data = 
        {
            APIKey: APIKey,
            channelId: tracker.channelId,
            messageId: tracker.messageId,
            memberId: character.member.id,
            memberUsername: character.member.user.username,
            memberDiscriminator: character.member.user.discriminator, 
            name: character.name,
            pool: character.pool,
            mod: character.mod,
            init: character.init
        };
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data.tracker;
        }
        else
        {
            console.error("Error in InitAPI.roll()");
            console.error(`Status: ${res?.status}`);
            throw new DatabaseAccessError();
        }
    }

    /*
    declares an action for a member
    Send:
    {
        channelId: string,
        messageId: string,
        memberId: string
        action: string
        redeclare: bool
    }
    Recieve:
    {
        status: string
    }
    */
    static async declare(interaction, tracker, character)
    {
        const host = `http://${IP}:${PORT}/bot/init/declare`;
        const data = 
        {
            APIKey: APIKey,
            channelId: interaction.channelId,
            messageId: tracker.messageId,
            memberId: interaction.user.id,
            memberUsername: character.member.user.username,
            memberDiscriminator: character.member.user.discriminator, 
            name: character.name,
            action: character.action,
            phase: tracker.phase
        };
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return res.data.tracker;
        }
        else
        {
            console.error("Error in InitAPI.declare()");
            console.error(`Status: ${res?.status}`);
            throw new DatabaseAccessError();
        }
    }

    /*
    get a messageId
    Receive:
    {
        channelId: string
    }
    Return:
    {
        status: string,    
        tracker: {TrackerObj}
    }
    */
    static async getTracker(interaction, lockout=false)
    {
        const host = `http://${IP}:${PORT}/bot/init/get`;
        const data = 
        {
            APIKey: APIKey,
            channelId: interaction.channelId,
            lockout: lockout
        };
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            if (res.data.status === 'no_tracker')
            {
                throw new NoInitTrackerError("No Tracker Available");
            }
            return res.data.tracker;
        }
        else
        {
            console.error("Error in InitAPI.getTracker()");
            console.error(`Status: ${res?.status}`);
            throw new DatabaseAccessError();
        }
    }

    /*
    Sets the new message ID
    Receive:
    {
        channelId: string,
        messageId: string
    }
    Return:
    {
        status: string
    }
    */
    static async setMessageId(interaction, messageId)
    {
        const host = `http://${IP}:${PORT}/bot/init/set`;
        const data = 
        {
            APIKey: APIKey,
            channelId: interaction.channelId,
            messageId: messageId
        };
        
        let res = await postData(host, data);
        if (res?.status === 200 && res?.data)
        {
            return true;
        }
        else
        {
            console.error("Error in InitAPI.getTracker()");
            console.error(`Status: ${res?.status}`);
            throw new DatabaseAccessError();
        }
    }
}

class APIError extends Error
{
    constructor(message) 
    {
        super(message);
        this.name = "APIError";
    }
}

class DatabaseAccessError extends APIError
{
    constructor() 
    {
        super("Could not access the database!");
        this.name = "DatabaseAccessError";
    }
}

class NoInitTrackerError extends APIError
{
    constructor() 
    {
        super("No Initiative tracker found!");
        this.name = "NoInitTrackerError";
    }
}

module.exports.APIError = APIError;
module.exports.DatabaseAccessError = DatabaseAccessError;
module.exports.NoInitTrackerError = NoInitTrackerError;