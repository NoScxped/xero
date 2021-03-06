const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transfer')
		.setDescription('Transfer an amount to someone else!')
        .addStringOption(option=> option.setName(`credits`).setDescription(`How many credits are you paying?`).setRequired(true))
        .addUserOption(option=> option.setName(`user`).setDescription(`Who are you paying?`).setRequired(true)),
	async execute(interaction, data, client, Discord, splashtext, loadCommands, worked) {
        if(interaction.options.getUser('user').bot){
            return interaction.reply('❌ **You cannot donate to bots!** ❌')
        }
        if(interaction.options.getUser('user').id === interaction.user.id){
            return interaction.reply('❌ **You cannot donate to yourself!** ❌')
        }
        if(data.read(`./data/user/${interaction.user.id}.json`, `credits`)){
            if(data.read(`./data/user/${interaction.options.getUser('user').id}.json`, "credits")){
                var creditsfrom = parseInt(data.read(`./data/user/${interaction.user.id}.json`, `credits`))
                var transferfrom = Math.abs(parseInt(interaction.options.getString('credits')))
                var creditsto = parseInt(data.read(`./data/user/${interaction.options.getUser('user').id}.json`, `credits`))
                var transferto = parseInt(data.read(`./data/user/${interaction.options.getUser('user').id}.json`, `credits`))
                if(creditsfrom > parseInt(interaction.options.getString('credits'))){

                    transferto = transferfrom + transferto
                    var dis = creditsfrom
                    creditsfrom = creditsfrom - transferfrom

                    var embed = new MessageEmbed()
                    .setTitle(`『 Credit Transfer 』`)
                    .setDescription(`» Would you like to transfer this amount to **${interaction.options.getUser('user').username}**?`)
                    .addField(`» Your credits`, `› ${dis}`, true)
                    .addField(`» Amount to transfer`, `› ${transferfrom}`, true)
                    .addField(`» **${interaction.options.getUser('user').username}**'s Credits`, `› ${creditsto}`)
                    .addField(`» **${interaction.options.getUser('user').username}**'s New Total`, `› ${transferto}`, true)
                    .setColor(`RANDOM`)
                    .setFooter({ text: `You have 15 seconds to reply!`, iconURL: client.user.avatarURL() });

                    var row = new MessageActionRow()
                    .addComponents(
                    new MessageButton()
                    .setCustomId(`accept`)
                    .setEmoji("<:checkmark:994105025292943390>")
                    .setStyle(`SUCCESS`),
                    new MessageButton()
                    .setCustomId('deny')
                    .setEmoji('<:xmark:994105062353817682>')
                    .setStyle('DANGER')
                )

                    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })

                    var filter = e => e.customId === "accept" || 'deny' && e.user.id === interaction.user.id
                    const collector = interaction.channel.createMessageComponentCollector({filter, time: 15000})
                    var res = false
                    collector.on(`end`, collected => {
                        if(res === false){
                        msg.edit({content: `❌ **This interaction has been cancelled!** ❌`, embeds: [], components: []})
                        }
                    })
                    collector.on(`collect`, async e => {
                        if(e.user.id === interaction.user.id){
                        if(e.customId === `deny`){
                            res = false
                            collector.stop()
                        }
                        if(e.customId === `accept`){
                            data.write(`./data/user/${interaction.user.id}.json`, "credits", creditsfrom.toString())
                            data.write(`./data/user/${interaction.options.getUser('user').id}.json`, "credits", transferto.toString())

                            var embed = new MessageEmbed()
                            .setTitle(`『 ✔️ **Transaction Successful!** ✔️ 』`)
                            .setDescription(`» **${interaction.user.username}** --> **${interaction.options.getUser('user').username}**`)
                            .addField(`» **${interaction.user.username}**'s credits`, `› ${creditsfrom}`, true)
                            .addField(`» Amount Transferred`, `› ${transferfrom}`, true)
                            .addField(`» **${interaction.options.getUser('user').username}**'s Credits`, `› ${transferto}`, true)
                            .setColor(`RANDOM`)
                            .setFooter({ text: `You have 15 seconds to reply!`, iconURL: client.user.avatarURL() });

                            msg.edit({embeds: [embed], components: []})

                            res = true
                            collector.stop()
                        }
    
                    }
                        })
                        
                    


                } else {
                    return interaction.reply("❌ **You do not have enough credits!** ❌")
                }
            }
            }
        }
    }