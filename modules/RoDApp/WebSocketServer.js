const Discord = require('discord.js');
const WebSocket = require('ws');
const Database = require('../util/Database.js');
//const Construct = require('../response/ConstructResponse.js');

/* 
**** Recv Protocol ****

** Content types **
1 - Login
{
    gameToken: string,
    type: int,
    userToken: string,
}

2 - ServerList
{
    type: int,
}

3 - ChannelList 
{
    type: int,
    guildID: string
}

4 - Post Roll
{
    type: int,
    channelID: string,
    notes: string,
    gameType: string,
    diff: int,
    pool: [{diceType: string, result: int}],
    reroll: bool
}

**** Send Protocol *****

** Response to Content types ***
1 - Login
{
    isAuthenticated: bool,
    userID: string,
    avatarURL: URL,
    username: string,
    discriminator: string,
}

2 - ServerList
{
    guilds: 
    [{
        guildID: string,
        name: string,
        iconURL: URL,
    },]
}

3 - ChannelList
{
    channels: 
    [{
        guildID: string,
        channelID: string,
        name: string,
        catagory: string,
        catPos: int,        
        chanPos: int,
    },]
}

4 - Post Roll
{
    posted: bool,
}

*/
module.exports = class WebSocketServer
{
    constructor(client, port) 
    {        
        this.client = client;
        this.wss = new WebSocket.Server({ port: port }); 
        this.gameToken = 'S#zJLhyYXzaN3sAiGN9y$5e?&YcScKHy';
        
        this.wss.on('connection', (ws) => {
            let player = new Player(this.client);
            let fromGame = false;

            const GUILD_REQ = 2;
            const CHANNEL_REQ = 3;
            const ROLL_REQ = 4;

            ws.on('message', (message) => {
                let content;
                try
                {
                    content = JSON.parse(message);
                }
                catch (SyntaxError)
                {
                    console.error("Websocket Error 0: content was not JSON");
                    ws.terminate();
                    return;
                }

                if (!fromGame) 
                {
                    if (content.gameToken != this.gameToken) 
                    {
                        console.error("Websocket Error 1: gameToken does not match");
                        ws.terminate();
                        return;
                    }
                    else 
                    {
                        fromGame = true;
                    }
                }

                if (!player.isAuthenticated())
                {
                   this.login(content, player, ws);
                }
                else if (content.type == GUILD_REQ) 
                {
                    this.getGuilds(player.userID, ws);
                }
                else if (content.type == CHANNEL_REQ)
                {
                    // channel request
                    this.getChannels(content.guildID, player.userID, ws);
                }
                else if (content.type == ROLL_REQ)
                {
                    // roll request
                    this.rollReq(content, ws, player.user);
                }
                console.log('received: %s', message);
            });
        
            ws.on('close', (c) => {
                console.log(`Closed: ${c}`);
            })
        });
    }

    login(content, player, ws)
    {
        if (content.type != 1 || 
            !content.gameToken || 
            !content.userToken) 
        {
            console.error("Websocket Error 2: protocol not followed");
            ws.terminate();
            return;
        }

        player.authenticate(content.userToken).then(auth => 
        {
            let reply = "";
            if (auth) 
            {
                reply += JSON.stringify(player.user);
            }
            else 
            {
                reply += JSON.stringify({isAuthenticated: false});
            }
            ws.send(reply);
        })
    }

    async getGuilds(id, ws)
    {
        let guildList = []
        await this.client.guilds.cache.each(async (guild) => {
            let member = await guild.members.fetch(id);
            if (!member) 
            {
                // User not in guild
                return;
            }

            let guildRes = 
            {
                guildID: guild.id,
                name: guild.name,
                iconURL: guild.iconURL({size:128, format: "png"})
            };
            guildList.push(guildRes);
        });

        let json = JSON.stringify({guilds: guildList});
        ws.send(json);
    }

    async getChannels(guildID, userID, ws)
    {
        if (!guildID) 
        {
            console.error("Websocket Error 3: protocol not followed");
            ws.terminate();
            return;
        }
        
        this.client.guilds.fetch(guildID).then((guild) => {
            let channelList = []
            let readWrite = new Discord
                .Permissions(["VIEW_CHANNEL", "SEND_MESSAGES"]);
            guild.channels.cache.each((channel) => 
            {
                if (!channel.isText() || 
                    !channel.permissionsFor(userID).has(readWrite) ||
                    !channel.permissionsFor(this.client.user.id).has(readWrite))
                {
                    // Is not Text OR Bot/User cannot read and write
                    return;
                }

                let channelRes = 
                {
                channelID: channel.id,
                name: channel.name,
                catagory: channel.parent.name,
                catPos: channel.parent.position,                
                chanPos: channel.position,
                };
                channelList.push(channelRes);
            });
            let json = JSON.stringify({channels: channelList});
            ws.send(json);            
        });        
    }

    /*
    {
        type: int,
        channelID: string,
        notes: string,
        gameType: string,
        diff: int,
        results: [{diceType: string, result: int}],
        reroll: bool
    }
    */
    rollReq(message, ws, user) 
    {
        let post;
        let posted = false;
        let construct = new Construct(this.client);
        switch (message.gameType)
        {
            case 'v5':
                post = construct.v5Roll(user, message.results, 
                    message.diff, message.reroll, message.notes);
                break;
        }

        let channel = this.client.channels.cache.get(message.channelID);
        if (post && channel)
        {
            try
            {
                channel.send(post.message, post.embed);
                //channel.send(`<@${user.userID}>`);                
                posted = true;
            }
            catch
            {
                console.error(`Failed to send message to ` +
                    `channel ${message.channelID}`);
            }
        }

        let json = JSON.stringify({'posted': posted});
        ws.send(json);
    }
}

class Player
{
    constructor(client)
    {
        this.client = client;
        this.authenticated = false;
        this.userToken = '';
        this.userID = '';
        this.user;
    }

    async authenticate(key) 
    {
        this.userToken = key;
        let db = new Database();
        db.open("TokenDatabase");

        if (!db.find('authenticate')) {
            db.new('authenticate', {});
        }
        let userID = db.find('authenticate')[this.userToken];

        if (!userID) 
        {
            this.authenticated = false;
            return false;
        }
        else 
        {
            this.authenticated = true;
            this.userID = userID;
            await this.getUser();
            return true;
        }
    }

    isAuthenticated()
    {
        return this.authenticated;
    }

    async getUser()
    {
        let discordUser = await this.client.users.fetch(this.userID);
        this.user = 
        {
            isAuthenticated: true,
            userID: discordUser.id,
            avatarURL: discordUser.avatarURL(),
            username: discordUser.username,
            discriminator: discordUser.discriminator
        };
    }
}