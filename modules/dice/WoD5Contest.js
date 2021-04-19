const Database = require('../util/Database.js');
const WoD5Dice = require('./WoD5Roll.js');
const Discord = require('discord.js');

const State = 
{
    Init: 0,
    Roll: 1,
    Surge: 2,
    Reroll: 3,
    Finish: 4,
}

const Result = 
{
    totalFail: 0,
    bestialFail: 1,
    fail: 2,
    success: 3,
    messyCrit: 4,
    crit: 5,    
}

module.exports = class WoD5Contest
{
    constructor(message)
    {
        this.recvMess = message;

        if (message.mentions.members)
            this.mentioned = message.mentions.members.first();

        this.author = message.author;
        this.guild = message.guild;
        this.channel = message.channel;
        this.data;
    }

    directMessage(message, content)
    {
        const invalidMess = "Sorry, you need to reply" +
            " to the previous message. This is so i know which" +
            " contest you are talking about.";

        if (!message.reference) return message.channel.send(invalidMess);

        message.channel.messages.fetch(message.reference.messageID)
        .then(mess => 
        {
            if (!mess.embeds || !mess.embeds[0].footer || 
                !mess.embeds[0].footer.text)
            {
                return message.channel.send(invalidMess);
            }
                
            let code = mess.embeds[0].footer.text.match(/<\w{6}>/i);
            if (!code) return message.channel.send(invalidMess);
            code = code[0];

            if (!this.deserializeData(code)) 
            return this.author.send("Sorry I could not locate the " +
                "contested roll with that reply. Please check that you" +
                " replied to the correct Message. If you did you will need to" +
                "start the contest over as it may have timed out.");
            
            if (this.data[this.author.id].state == State.Roll)
            {
                this._dmRoll(content);
            }
            else if (this.data[this.author.id].state == State.Reroll)
            {
                this._dmReroll(content);
                this._checkIfFinished();
            }
            else 
            {
                this.author.send('There is no need to use this ' +
                    'command at this moment.');
            }
        });
    }

    _dmRoll(content)
    {
        if (!content.match(/\s*\d+(\s+\d+)?/i))
            return this.author.send("Sorry this command is not right." +
            "The command should be `/c <pool> {hunger} <code> {notes}`" +
            "\neg. `/c 5 2 --YcF5 rolling for Str + Brawl + surge`");

        
        const wod5Dice = new WoD5Dice(this.recvMess.client, this.author);
        wod5Dice.parseContent(content);

        if (wod5Dice.error) return this.author.send(wod5Dice.constructEmbed());

        this._surgeMessage(wod5Dice);
    }

    _surgeMessage(wod5Dice)
    {
        this.data[this.author.id].state = State.Surge;
        let embed = new Discord.MessageEmbed();
        
        embed.setTitle("Blood Surge")
        .setDescription("Would you like to rouse the blood for a Blood" +
        " Surge?\nYou risk gaining 1 hunger but can add dice to your roll." +
        "\nIf yes just let me know your Blood Potency.")
        .addField("Potency 0", "```+1 Dice```", true)
        .addField("Potency 1/2", "```+2 Dice```", true)
        .addField("Potency 3/4", "```+3 Dice```", true)
        .setFooter(`Contest ID ${this.data.code}`);

        this.author.send(embed)
        .then(mess =>
            {
                this._surgeCollector(mess, wod5Dice);
                mess.react('❌')
                mess.react('0️⃣')
                mess.react('1️⃣')
                mess.react('2️⃣')
                mess.react('3️⃣')
                mess.react('4️⃣');
            });       
    }

    _surgeCollector(message, wod5Dice)
    {
        const TIMEOUT = 1
        const filter = (reaction, user) => {
            return ((reaction.emoji.name === '❌' 
                || reaction.emoji.name === '0️⃣'
                || reaction.emoji.name === '1️⃣'
                || reaction.emoji.name === '2️⃣'
                || reaction.emoji.name === '3️⃣'
                || reaction.emoji.name === '4️⃣') 
                && !user.bot);
        };

        const collector = message.createReactionCollector(filter, 
            {time: this.hourToMili(TIMEOUT), max: 1});

        collector.on('collect', (reaction, user) => {
            let surge = 0;
            switch (reaction.emoji.name)
            {
                case '❌':
                    break;
                case '4️⃣':
                case '3️⃣':
                    surge ++;
                case '2️⃣':                    
                case '1️⃣':
                    surge++;
                case '0️⃣':
                    surge++;
                default:
                    wod5Dice.addSurge(surge, reaction.emoji.name);
            }
            
            this.data[user.id].state = State.Reroll;
            this.serializeData(user.id);
            this._sendRollResults(wod5Dice);
        });

        collector.on('end', (collected, reason) => 
        {
            if (reason == 'time')
            {
                this.removeSerializedData();
                this.author.send("Sorry, one of you took too long to respond" +
                    "If you wish to redo the content, please send another" +
                    " command from the server");
            }
        });
    }

    _sendRollResults(wod5Dice)
    {
        let userInfo = this.data[this.author.id];
        wod5Dice.roll();
        let response = wod5Dice.constructEmbed()
        const roll = wod5Dice.getSerializedRoll();        
        userInfo.roll = roll;
        this.serializeData(this.author.id);
        this.author.send(response.message, response.embed);
        this._sendWillpowerMessage();
    }

    _sendWillpowerMessage(wod5Dice)
    {
        let embed = new Discord.MessageEmbed();
        
        embed.setTitle("Willpower Reroll")
        .setDescription("Would you like to spend a point of willpower" +
        " to reroll up to 3 regular dice?")
        .setFooter(`Contest ID ${this.data.code}`);

        this.author.send(embed)
        .then(mess =>
            {
                this._willpowerCollector(mess, wod5Dice);
                mess.react('❌')
                mess.react('✅');
            });    
    }

    _willpowerCollector(message)
    {
        const TIMEOUT = 1
        const filter = (reaction, user) => {
            return ((reaction.emoji.name === '❌' 
                || reaction.emoji.name === '✅') 
                && !user.bot);
        };

        const collector = message.createReactionCollector(filter, 
            {time: this.hourToMili(TIMEOUT), max: 1});

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '✅')
            {
                let embed = new Discord.MessageEmbed();
        
                embed.setTitle("Reroll")
                .setDescription("To reroll enter the reroll command found" +
                " below.\n If you opt for the Select reroll choose the" +
                " dice number or type from the message that was sent before.\n" +
                "Types are: crit, fail, pass. Or in shorthand: c, f, p, s" +
                "\nRemember to reply to this message for it to work.")
                .setFooter(`Contest ID ${this.data.code}`)
                .addField("Quick Reroll", `\`\`\`/c {notes}\`\`\``)
                .addField("Select Reroll", "```/c <dice> {dice} {dice} {notes}```")
                .addField("Example", 
                    `\`\`\`/c fail fail crit notes\`\`\``);

                this.data[user.id].state = State.Reroll;
                this.serializeData(user.id);
                return this.author.send(embed)
            }
            else
            {
                this.data[user.id].state = State.Finish;
                this.serializeData(this.author.id);
                this._checkIfFinished();
            }
        });

        collector.on('end', (collected, reason) => 
        {
            if (reason == 'time')
            {
                this.removeSerializedData();
                this.author.send("Sorry, one of you took too long to respond" +
                    "If you wish to redo the content, please send another" +
                    " command from the server");
            }
        });
    }

    _checkIfFinished()
    {
        let opponent;
        if (this.data.author == this.author.id) opponent = this.data.mentioned;
        else opponent = this.data.author;

        if (this.data[this.data.author].state == State.Finish &&
            this.data[this.data.mentioned].state == State.Finish)
        {
            this.author.send("All done! Check the guild channel for the" +
                " results. Good Luck!");

            this.recvMess.client.channels.fetch(this.data.channelID)
            .then(channel =>
            {
                const mInfo = this.data[this.data.mentioned];
                const aInfo = this.data[this.data.author];
                const author = 
                    this.recvMess.client.users.cache.get(this.data.author);
                const mentioned = 
                    this.recvMess.client.users.cache.get(this.data.mentioned);

                author.username = this.data[author.id].username;
                mentioned.username = this.data[mentioned.id].username;
                
                const authorDice = 
                    new WoD5Dice(this.recvMess.client, author);
                authorDice.deserializeFromPayload(aInfo.roll);                

                const mentionedDice = 
                    new WoD5Dice(this.recvMess.client, mentioned);
                mentionedDice.deserializeFromPayload(mInfo.roll);

                
                if (aInfo.attacker && !mInfo.attacker)
                {
                    authorDice.setDifficulty(mInfo.roll.total);
                    mentionedDice.setDifficulty(aInfo.roll.total + 1);
                }
                else if (mInfo.attacker && !aInfo.attacker)
                {
                    authorDice.setDifficulty(mInfo.roll.total + 1);
                    mentionedDice.setDifficulty(aInfo.roll.total);
                }
                else
                {
                    authorDice.setDifficulty(mInfo.roll.total);
                    mentionedDice.setDifficulty(aInfo.roll.total);
                }

                const aRoll = authorDice.constructEmbed();
                const mRoll = mentionedDice.constructEmbed();
                const summery = this._constructSummeryEmbed(
                    authorDice, mentionedDice);

                channel.send(`Contest Summery for <@${this.data.author}> ` +
                    `and <@${this.data.mentioned}>`);
                
                channel.send(aRoll.message, aRoll.embed);
                channel.send(mRoll.message, mRoll.embed);                
                channel.send(summery);

                this.removeSerializedData();          
            });
        }
        else
        {
            this.author.send("Awesome! We are just waiting on" +
                ` ${this.data[opponent].username} to finish their roll.`)
        }
    }

    _constructSummeryEmbed(aRoll, mRoll)
    {
        let embed = new Discord.MessageEmbed();
        
        let author = `${aRoll.total} suxx`;
        let mentioned = `${mRoll.total} suxx`;

        if (aRoll.result == Result.bestialFail)
        {
            author += ' - Bestial Failure';
        }
        else if (aRoll.result == Result.crit)
        {
            author += ' - Critical';
        }
        else if (aRoll.result == Result.messyCrit)
        {
            author += ' - Messy Critical';
        }
        else if (aRoll.resul == Result.totalFail)
        {
            author += ' - Total Failure';
        }

        if (mRoll.result == Result.bestialFail)
        {
            mentioned += ' - Bestial Failure';
        }
        else if (mRoll.result == Result.crit)
        {
            mentioned += ' - Critical';
        }
        else if (mRoll.result == Result.messyCrit)
        {
            mentioned += ' - Messy Critical';
        }
        else if (mRoll.resul == Result.totalFail)
        {
            mentioned += ' - Total Failure';
        }


        embed.setTitle("Summery")
        .addField(`${this.data[this.data.author].username} Rolled`, author)
        .addField(`${this.data[this.data.mentioned].username} Rolled`, mentioned)

        let resultTitle;

        if (aRoll.total == mRoll.total && aRoll.diff == mRoll.diff)
        {
            resultTitle = 'Tie';
        }
        else resultTitle = 'Winner';

        let result;

        if (resultTitle == 'Tie')
        {
            result = 'Both participants are attacking and the contest is a' +
                ' tie.\nEach user takes 1 margin of damage.'
            embed.setColor([204, 190, 190]);
            embed.setThumbnail('https://cdn.discordapp.com/attachments/' +
                '714050986947117076/833637396229914684/sword-icon-png-7.png');
        }
        else if (aRoll.result > Result.fail)
        {
            result = `${this.data[this.data.author].username} ` +
                `with a margin of ${aRoll.total - aRoll.diff}`;
            
            if (this.data[this.data.author].attacker) embed.setColor(
                [207, 17, 48]);
            else embed.setColor([23, 154, 255]);
            embed.setThumbnail(aRoll.user.displayAvatarURL());
        }
        else
        {
            result = `${this.data[this.data.mentioned].username} ` +
                `with a margin of ${mRoll.total - mRoll.diff}`;
            
            if (this.data[this.data.mentioned].attacker) embed.setColor(
                [207, 17, 48]);
            else embed.setColor([23, 154, 255]);
            embed.setThumbnail(mRoll.user.displayAvatarURL());
        }
        embed.addField(resultTitle, result)
        .setFooter(`Contest ID ${this.data.code}`);
        return embed;
    }

    _dmReroll(content)
    {
        const data = this.data[this.author.id];
        const wod5Dice = new WoD5Dice(this.recvMess.client, this.author);
        wod5Dice.deserializeFromPayload(data.roll);

        if (content.match
            (/^\s*(\d+|f|c|s|p|fail|crit|sux)(\s+(\d+|f|c|s|p|fail|crit|sux))?(\s+|$)/i))
        {
            wod5Dice.parseReroll(content);
        }
        else
        {
            wod5Dice.quickReroll(content);
        }

        if (wod5Dice.error) return this.author.send(wod5Dice.constructEmbed());
        
        wod5Dice.rerollDice();
        let response = wod5Dice.constructEmbed();

        this.data[this.author.id].roll = wod5Dice.getSerializedRoll();
        this.data[this.author.id].state = State.Finish;
        this.serializeData(this.author.id);

        return this.author.send(response.message, response.embed);
    }

    guildMessage()
    {
        const db = new Database();
        db.open('Contests', 'Database');

        let code = this._codeGen();        
        while (db.find(code)) 
        {
            code = this._codeGen();
        }

        let data = 
        {
            channelID: this.channel.id,
            author: this.author.id,
            mentioned: this.mentioned.id,
            initTime: Date.now(),
            code: code,
        };

        data[this.author.id] = 
        {
            roll: undefined,
            attacker: undefined,
            state: State.Init,
            username: this.recvMess.member.displayName,
        };

        data[this.mentioned.id] = 
        {
            roll: undefined,
            attacker: undefined,
            state: State.Init,
            username: this.mentioned.displayName,
        };

        this.data = data;
    }

    userPositionCollector(message)
    {
        const TIMEOUT = 48
        const filter = (reaction, user) => {
            return ((reaction.emoji.name === '⚔️' 
                || reaction.emoji.name === '🛡️') 
                && !user.bot);

        };

        const collector = message.createReactionCollector(filter, 
            {time: this.hourToMili(TIMEOUT), max: 1});

        collector.on('collect', (reaction, user) => 
        {
            if (reaction.emoji.name === '⚔️') 
                this.data[user.id].attacker = true;
            else this.data[user.id].attacker = false;
            
            this.data[user.id].state = State.Roll;
            this.serializeData(user.id);
            this.sendDiceMessage(message, user);
        });

        collector.on('end', (collected, reason) => 
        {
            if (reason == 'time')
            {
                this.removeSerializedData();
                this.author.send("Sorry, one of you took too long to respond" +
                    "If you wish to redo the content, please send another" +
                    " command from the server");
            }
        });
    }

    sendDiceMessage(message, user)
    {
        let response;
        if (this.data[user.id].attacker) response = 'Attacking';
        else response = 'Defending';
        
        let dm = `Great so you are ${response}!\n` +
            'Next lets get the roll sorted out.';

        let embed = new Discord.MessageEmbed();
        
        embed.setTitle("The Roll")
        .setDescription("Please enter the roll command including your" +
        " pool and any hunger. Do not add any surge dice at this point.\n " +
        "Also please reply to this message when entering your command.")
        .setFooter(`Contest ID ${this.data.code}`)
        .addField("Usage", "```/c <pool> {hunger} {notes}```")
        .addField("Example", 
            `\`\`\`/c 5 2 str + brawl + surge\`\`\``);
        message.channel.send(dm, embed);
    }

    serializeData(user)
    {
        const db = new Database();
        db.open('Contests', 'Database');
        if (db.find(this.data.code)) this._syncOpponent(db, user);
        db.add(this.data.code, this.data);
        db.close();
    }

    deserializeData(code)
    {
        const db = new Database();
        db.open('Contests', 'Database');
        let data = db.find(code);

        if (!data) return false;
        if (!data[this.author.id]) return false;
        
        this.data = data;
        return true;
    }

    removeSerializedData()
    {
        const db = new Database();
        db.open('Contests', 'Database');
        db.delete(this.data.code);
        db.close();
    }

    _syncOpponent(db, user)
    {
        let opponent;
        if (this.data.author == user) 
            opponent = this.data.mentioned;
        else opponent = this.data.author;
        const saved = db.find(this.data.code);
        this.data[opponent] = saved[opponent];
    }

    _codeGen()
    {
        let code = '<';
        for (let i = 0; i < 6; i++)
        {
            let char = '.';
            while (char.match(/\W/i))
            {
                char = String.fromCharCode(Math.floor(Math.random() * 74) + 48);
            }
            code += char;
        }
        return code += '>';
    }

    hourToMili(hour)
    {
        return ((hour*60)*60)*1000
    }
}