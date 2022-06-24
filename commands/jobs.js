const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Message, Discord, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('joblist')
		.setDescription('(DEPRECATED) Job List'),
	async execute(interaction, data, client, Discord, splashtext) {
        const fs = require('fs');
        const jobs = JSON.parse(fs.readFileSync('./data/global/jobs.json', 'utf-8'))
        var send = ''
        for(var i in jobs){
            send = send + `**» ${jobs[i].name}** › ID: **${jobs[i].id}**\n`
        }
        var embed = new MessageEmbed()
        .setTitle("『 Job List 』")
        .setColor("RANDOM")
        .setDescription(send)
        .setFooter({ text: `/job id`, iconURL: client.user.avatarURL() });
        interaction.channel.send('⚠️ **/joblist is now deprecated! Use /jobs for a better experience :)** ⚠️')
        interaction.reply({embeds: [embed]})
    }
}