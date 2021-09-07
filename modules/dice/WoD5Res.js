'use strict';

const Roll = require('./Roll.js');
const Discord = require('discord.js');

module.exports = class WoD5Roll
{
    constructor()
    {
        this.tempResults = ""
        this.resResult = "";
        this.temp = "";
        this.res = "";
        this.mech = "";
        this.emo = "";

        this.colourMod = 0
        this.color = [0, 0, 0];
    }

    rollTemp()
    {
        let temp = Roll.single(10);
        this.tempResults += temp.toString();

        if (temp >= 9)
        {
            temp = Roll.single(10);
            this.tempResults += ` ${temp.toString()}`;
            
            if (temp <= 8)
            {
                this.temp = "Intense";
                this.color = [180, 180, 180];
                this.colourMod = 2;
            }
            else
            {
                this.temp = "Acute";
                this.color = [254, 254, 254];
                this.colourMod = 3;
            }
        }
        else if (temp >= 6)
        {
            this.temp = "Fleeting";
            this.color = [125, 125, 125];
            this.colourMod = 1;
        }
        else this.temp = "Negligible";
    }

    rollRes()
    {
        if (this.temp == 'Negligible') return;
        if (!this.resResult) this.resResult = Roll.single(10).toString();
        
        if (this.resResult >= 9) 
        {
            this.res = "Sanguine";
            this.emo = "Horny, Happy, Addicted,\nActive, Flighty, Enthusiastic";

            if (this.colourMod === 1) 
            {
                this.color = [150, 0, 143];
                this.mech = "Blood Sorcery, Presence";
            }
            else if (this.colourMod === 2) this.color = [200, 0, 192];
            else this.color = [255, 0, 242];

            if (this.colourMod > 1)
            {
                this.mech = "Blood Sorcery, Presence\nAdd +1 dice";
            }
        }
        else if (this.resResult >= 7) 
        {
            this.res = "Choleric";
            this.emo = "Angry, Violent, Bullying,\nPassionate, Envious";

            if (this.colourMod === 1)
            {
                this.color = [150, 0, 0];
                this.mech = "Celerity, Potence";
            }
            else if (this.colourMod === 2) this.color = [200, 0, 0];
            else this.color = [255, 0, 0];

            if (this.colourMod > 1)
            {
                this.mech = "Celerity, Potence\nAdd +1 dice";
            }
        }
        else if (this.resResult >= 4) 
        {
            this.res = "Melancholy";
            this.emo = "Sad, Scared, Intellectual,\nDepressed, Grounded";

            if (this.colourMod === 1) 
            {
                this.color = [0, 133, 150];
                this.mech = "Fortitude, Obfuscate";
            }
            else if (this.colourMod === 2) this.color = [0, 177, 200];
            else this.color = [0, 225, 255];

            if (this.colourMod > 1)
            {
                this.mech = "Fortitude, Obfuscate\nAdd +1 dice";
                
            }
        }
        else 
        {
            this.res = "Phlegmatic";
            this.emo = "Lazy, Apathetic, Calm,\nControlling, Sentimental";

            if (this.colourMod === 1) 
            {
                this.color = [0, 150, 0];
                this.mech = "Auspex, Dominate";
            }
            else if (this.colourMod === 2) this.color = [0, 200, 0];
            else this.color = [0, 255, 0];

            if (this.colourMod > 1)
            {
                this.mech = "Auspex, Dominate\nAdd +1 dice";
            }
        }
    }

    addRes(content)
    {
        if (content.match(/Phlegmatic/i)) this.resResult = 1;
        else if (content.match(/Melancholy/i)) this.resResult = 4;
        else if (content.match(/Choleric/i)) this.resResult = 7;
        else if (content.match(/Sanguine/i)) this.resResult = 9;

        if (this.resResult) this.rollRes();
    }
    
    constructEmbed(message, notes)
    {
        let username;
        if (message.member) username = message.member.displayName;
        else username = message.author.username;
        let avatarURL = message.author.avatarURL();
        
        // Create the embed
        let embed = new Discord.MessageEmbed();
        // Change to try and use DisplayNames if available.
        embed.setAuthor(username, avatarURL)
        .setTitle('Rolling for Resonance')
        .addField("Result", `\`\`\`${this.temp} ${this.res}\`\`\``, true)
        .addField("Temperament", `\`\`\`${this.tempResults}\`\`\``, true)
        .setColor(this.color)
        .setURL('https://discord.gg/Za738E6');

        if (this.res) 
            embed.addField("Resonance", `\`\`\`${this.resResult}\`\`\``, true);
        
        if (this.mech) embed.addField("Disciplines", this.mech, true);
        if (this.emo) embed.addField("Emotions", this.emo, true);

        if (notes) embed.addField("Notes", notes);

        return embed;
    }
}