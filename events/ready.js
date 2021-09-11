'use strict';
const setActivity = require('../modules/util/setActivity.js');
const Database = require("../modules/util/Database");
const { statChannel } = require("../config.json");
const { MessageEmbed } = require("discord.js");
setInterval(displayStats, 900000);

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log("Connected as: " + client.user.tag);
        setActivity(client);
        displayStats(client);

        let db = new Database();
        db.open('Contests', 'Database');
        db.deleteAll();
	},
};

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
        channel.send(userEmbed)
            .then(message =>
                {
                    db.add("userCount", message.id);
                    db.close();
                });
    }
    else
    {
        channel.messages.fetch(userCountID).then(message => 
            {
                message.edit(userEmbed)
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
        channel.send(commandEmbed)
            .then(message =>
                {
                    db.add("commandUsage", message.id);
                    db.close();
                });
    }
    else
    {
        channel.messages.fetch(commandUsageID).then(message => 
            {
                message.edit(commandEmbed);
            });
    }
}