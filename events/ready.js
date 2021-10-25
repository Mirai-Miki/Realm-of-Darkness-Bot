'use strict';
//const setActivity = require('../modules/util/setActivity.js');
//const Database = require("../modules/util/Database");
//const { statChannel } = require("../config.json");
const { MessageEmbed } = require("discord.js");


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log("Connected as: " + client.user.tag);
        setActivity(client);
        //displayStats(client);
        //setInterval(function() {displayStats(client)}, 900000);

        //let db = new Database();
        //db.open('Contests', 'Database');
        //db.deleteAll();
	},
};


// Doesn't Track anything because it is working of old Commands
// Not interactions. Will need to change this.
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
function displayStats(client)
{
    const channel = client.channels.cache.get(statChannel);
    
    const db = new Database();
    db.open("StatMessages", 'Database');


    const userDB = new Database();
    userDB.open("UserCount", 'Database');
    const userCountID = db.find("userCount");
    const userEmbed = new MessageEmbed()
        .setTitle("User Count")
        .setDescription(`${userDB.length()}`)
        .setTimestamp()
        .setColor('#bf1bc4')
    if (!userCountID)
    {
        channel.send({embeds: [userEmbed]})
            .then(message =>
                {
                    db.add("userCount", message.id);
                    db.save();
                });
    }
    else
    {
        channel.messages.fetch(userCountID).then(message => 
        {
            message.edit({embeds: [userEmbed]})
        }).catch(error => {
            channel.send({embeds: [userEmbed]})
            .then(message =>
                {
                    db.add("userCount", message.id);
                    db.save();
                });
        });
    }


    const commandDB = new Database();
    commandDB.open("CommandUsage", 'Database');
    const commandUsageID = db.find("commandUsage");
    const commandEmbed = new MessageEmbed()
        .setTitle("Command Usage Information")
        .setTimestamp()
        .setColor('#199e1e')
    for (const [key, value] of Object.entries(commandDB.db)) {
            commandEmbed.addField(`${key}`, `${value}`);
    }
    if (!commandUsageID)
    {
        channel.send({embeds: [commandEmbed]})
            .then(message =>
            {
                db.add("commandUsage", message.id);
                db.save();
            });
    }
    else
    {
        channel.messages.fetch(commandUsageID).then(message => 
        {
            message.edit({embeds: [commandEmbed]});
        }).catch(error => {
            channel.send({embeds: [commandEmbed]})
            .then(message =>
                {
                    db.add("commandUsage", message.id);
                    db.save();
                });
        });
    }
}