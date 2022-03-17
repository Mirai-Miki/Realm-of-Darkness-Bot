'use strict';
const Roll = require('../Roll.js');
const { MessageEmbed } = require('discord.js');

module.exports = class Resonance
{
    constructor(interaction)
    {
        this.interaction = interaction;
        this.colour = {hex: [0, 0, 0], mod: 0};

        this.temp = {
            name: this.interaction.options.getString('temperament') ?? '',
            dice: '',
        }
        this.res = {
            name: this.interaction.options.getString('resonance') ?? '', 
            description: '',
            mechanic: '',
            dice: '',
        }
        this.notes = this.interaction.options.getString('notes');
    }

    roll()
    {
        this.rollTemp();
        this.rollRes();
    }

    rollTemp()
    {
        let temp;
        if (!this.temp.name)
        {
            temp = Roll.single(10);
            this.temp.dice += `${temp}`;
        }
        

        if (temp >= 9 || this.temp.name === 'Intense' || 
            this.temp.name === 'Acute')
        {
            if (!this.temp.name)
            {
                temp = Roll.single(10);
                this.temp.dice += ` ${temp.toString()}`;
            }            
            
            if (temp <= 8 || this.temp.name === 'Intense')
            {
                this.temp.name = "Intense";
                this.colour.hex = [180, 180, 180];
                this.colour.mod = 2;
            }
            else
            {
                this.temp.name = "Acute";
                this.colour.hex = [254, 254, 254];
                this.colour.mod = 3;
            }
        }
        else if (temp >= 6 || this.temp.name === 'Fleeting')
        {
            this.temp.name = "Fleeting";
            this.colour.hex = [125, 125, 125];
            this.colour.mod = 1;
        }
        else this.temp.name = "Negligible";
    }

    rollRes()
    {
        if (this.temp.name == 'Negligible') return;
        let dice;
        if (!this.res.name) 
        {            
            dice = Roll.single(10);
            this.res.dice = `${dice}`;
        }
        
        if (dice >= 9 || this.res.name === 'Sanguine') 
        {
            this.res.name = "Sanguine";
            this.res.description = 
                "Horny, Happy, Addicted,\nActive, Flighty, Enthusiastic";

            if (this.colour.mod === 1) 
            {
                this.colour.hex = [150, 0, 143];
                this.res.mechanic = "Blood Sorcery, Presence";
            }
            else if (this.colour.mod === 2) this.colour.hex = [200, 0, 192];
            else this.colour.hex = [255, 0, 242];

            if (this.colour.mod > 1)
            {
                this.res.mechanic = "Blood Sorcery, Presence\nAdd +1 dice";
            }
        }
        else if (dice >= 7 || this.res.name === 'Choleric') 
        {
            this.res.name = "Choleric";
            this.res.description = 
                "Angry, Violent, Bullying,\nPassionate, Envious";

            if (this.colour.mod === 1)
            {
                this.colour.hex = [150, 0, 0];
                this.res.mechanic = "Celerity, Potence";
            }
            else if (this.colour.mod === 2) this.colour.hex = [200, 0, 0];
            else this.colour.hex = [255, 0, 0];

            if (this.colour.mod > 1)
            {
                this.res.mechanic = "Celerity, Potence\nAdd +1 dice";
            }
        }
        else if (dice >= 4 || this.res.name === 'Melancholy') 
        {
            this.res.name = "Melancholy";
            this.res.description = 
                "Sad, Scared, Intellectual,\nDepressed, Grounded";

            if (this.colour.mod === 1) 
            {
                this.colour.hex = [0, 133, 150];
                this.res.mechanic = "Fortitude, Obfuscate";
            }
            else if (this.colour.mod === 2) this.colour.hex = [0, 177, 200];
            else this.colour.hex = [0, 225, 255];

            if (this.colour.mod > 1)
            {
                this.res.mechanic = "Fortitude, Obfuscate\nAdd +1 dice";                
            }
        }
        else 
        {
            this.res.name = "Phlegmatic";
            this.res.description = 
                "Lazy, Apathetic, Calm,\nControlling, Sentimental";

            if (this.colour.mod === 1) 
            {
                this.colour.hex = [0, 150, 0];
                this.res.mechanic = "Auspex, Dominate";
            }
            else if (this.colour.mod === 2) this.colour.hex = [0, 200, 0];
            else this.colour.hex = [0, 255, 0];

            if (this.colour.mod > 1)
            {
                this.res.mechanic = "Auspex, Dominate\nAdd +1 dice";
            }
        }
    }

    constructEmbed()
    {
        // Create the embed
        let embed = new MessageEmbed();
        embed.setAuthor(
            (
                this.interaction.member ? 
                this.interaction.member.displayName : 
                this.interaction.user.username
            ), 
            this.interaction.user.avatarURL()
        );
        embed.setTitle('Resonance Roll');
        embed.setColor(this.colour.hex);
        embed.setURL('https://discord.gg/Qrty3qKv95');

        embed.addField("Result", `\`\`\`${this.temp.name}` +
            `${this.temp.name == 'Negligible' ? '' : (' '+this.res.name)}\`\`\``, 
            true);
        embed.addField("Temperament", 
            `\`\`\`${this.temp.dice ? this.temp.dice : this.temp.name}\`\`\``, 
            true);
        if (this.res.dice || this.res.name)
        {
            embed.addField("Resonance", 
                `\`\`\`${this.res.dice ? this.res.dice : this.res.name}\`\`\``, 
                true);
        }
            
        
        
        if (this.res.mechanic) 
            embed.addField("Disciplines", this.res.mechanic, true);
        if (this.res.description) 
            embed.addField("Emotions", this.res.description, true);

        if (this.notes) embed.setFooter(this.notes);
        
        this.embed = embed;
        return embed;
    }

    reply()
    {
        this.interaction.reply({embeds: [this.embed]});
    }
}