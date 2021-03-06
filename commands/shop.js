const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('shop')
	.setDescription('View the Xero Shop')
    .toJSON(),

    async execute(interaction, data, client, Discord, splashtext) {

        const items = JSON.parse(data.read('./data/global/items.json'))
        const msg = await interaction.reply({ content: '<a:typing:994063591340773466> *Xero is thinking* <a:typing:994063591340773466>', fetchReply: true, embeds: [], components: []})

        var prc = 0
        var ident = ""
        var max = 0
        const backbar = new MessageActionRow()
                                .addComponents(
                                new MessageButton()
                                   .setCustomId(`back`)
                                   .setLabel(`Back`)
                                   .setStyle(`PRIMARY`))
        var embed = new MessageEmbed()
                .setTitle(`『 Xero Store 』`)
                .setDescription(`» Select an item`)
                .setColor(`RANDOM`)
                .setFooter({ text: `You have 30 seconds to reply!`, iconURL: client.user.avatarURL() });

        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select an item'));

        for(var i in items){

                itm= items[i].id

            if(items[i].inShop){

                       row.components[0].addOptions([{

                            label: `${items[i].name}`,
                            description: `${items[i].description}`,
                            value: `${items[i].id}`,

                            }]);

                        } 
                    
                            
            
            }

            function loadShop(){

            msg.edit({content: '_ _', embeds: [embed], components: [row]})

            }

            loadShop()

            var filter = i => i.user.id === interaction.user.id

            const collector = interaction.channel.createMessageComponentCollector({filter, idle: 30000})
                var cont = true
                var res = false

            var str = ""

            collector.on(`collect`, async i => {

                i.deferUpdate()

                if(i.values){

                  str = Array.from(i.values)

                }

                if(i.customId){

                    if(i.customId === 'accept'){

                        if(parseInt(data.read(`./data/user/${interaction.user.id}.json`, `credits`)) >= parseInt(prc)){

                            if(data.read(`./data/user/${interaction.user.id}.json`, ident) && data.read(`./data/user/${interaction.user.id}.json`, ident) != NaN){

                                

                                if(parseInt(data.read(`./data/user/${interaction.user.id}.json`, ident)) >= parseInt(max)){

                                    embed = new MessageEmbed()
                                    .setTitle(`『 ❌ Purchase Failed! ❌ 』`)
                                    .setDescription(`You can only have *${max}* of this item!`)
                                    .setColor("RANDOM")
                                    .setFooter({ text: splashtext, iconURL: client.user.avatarURL() });
                                    cont = false
                                    await msg.edit({embeds: [embed], components: [backbar]})
                                    res = true
                                    
                                    
                                    
                                }

                                embed = new MessageEmbed()
                                .setTitle(`『 Purchase Successful! 』`)
                                .setDescription('You have successfully purchased this item!')
                                .setColor("RANDOM")
                                .setFooter({ text: splashtext, iconURL: client.user.avatarURL() });

                                var add = parseInt(data.read(`./data/user/${interaction.user.id}.json`, ident)) + 1
                                var sub = parseInt(data.read(`./data/user/${interaction.user.id}.json`, `credits`)) - parseInt(prc)
                                console.log(ident)
                                data.write(`./data/user/${interaction.user.id}.json`, ident.toString(), add.toString())
                                data.write(`./data/user/${interaction.user.id}.json`, `credits`, sub.toString())
                                cont = false
                                res = true
                                await msg.edit({embeds: [embed], components: [backbar]})
                                
                            } else {

                                res = true
                                var sub = parseInt(data.read(`./data/user/${interaction.user.id}.json`, `credits`)) - parseInt(prc)

                                data.write(`./data/user/${interaction.user.id}.json`, `credits`, sub.toString())
                                data.write(`./data/user/${interaction.user.id}.json`, ident, `1`)

                                embed = new MessageEmbed()
                                .setTitle(`『 Purchase Successful! 』`)
                                .setDescription('You have successfully purchased this item!')
                                .setColor("RANDOM")
                                .setFooter({ text: splashtext, iconURL: client.user.avatarURL() });
                                cont = false
                                await msg.edit({embeds: [embed], components: [backbar]})
                                

                            }
    
                        } else {

                            res = true
                            cont = false
                            embed = new MessageEmbed()
                                .setTitle(`『 ❌ Purchase Failed! ❌ 』`)
                                .setDescription('You do not have enough money!')
                                .setColor("RANDOM")
                                .setFooter({ text: splashtext, iconURL: client.user.avatarURL() });

                                await msg.edit({embeds: [embed], components: []})
                                
    
                        }

                        
                    }
                    if(i.customId === 'deny'){

                        cont  = false
                        res = false
                        collector.stop()

                    }
                    if(i.customId === 'back'){

                        cont = true
                        res = false
                        loadShop()
                        
                    }
                }
                for(var i in items){

                    if(cont === true){

                    if(items[i].id === str[0]){
                        max = parseInt(items[i].max)
                        prc = items[i].price
                        ident = items[i].id.toString()
                        var embed = new MessageEmbed()
                        .setTitle(`『 ${items[i].name} 』`)
                        .setDescription(`» ${items[i].description}`)
                        .addField(`» Price`, `› ${items[i].price} ⌬`)
                        .setColor(`RANDOM`)
                        .setFooter({ text: `You have 30 seconds to reply!`, iconURL: client.user.avatarURL() });

                        var acceptbar = new MessageActionRow()
                         .addComponents(
                         new MessageButton()
                            .setCustomId(`accept`)
                            .setEmoji('<:checkmark:994105025292943390>')
                            .setStyle(`SUCCESS`),
                        new MessageButton()
                            .setCustomId(`deny`)
                            .setEmoji('<:xmark:994105062353817682>')
                            .setStyle(`DANGER`)
                        )
                
                        await msg.edit({embeds: [embed], components: [row, acceptbar]})
                    
                
                }
                    }
                }
        })

            collector.on(`end`, collected => {

                if(res === false){

                    return msg.edit({content: "<:xmark:994105062353817682> *This interaction has been closed!* <:xmark:994105062353817682>", embeds: [], components: []})
                    

                }
            })
        }

        }
