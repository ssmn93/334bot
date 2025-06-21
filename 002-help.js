const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//334
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('コマンドやサポート等の情報一覧'),
	async execute(interaction) {
      const embed = new EmbedBuilder()
       // .setTitle('334bot ヘルプ')
       .addFields({ name: 'ヘルプ', value: '[サポートサイト](<https://334bot-official.glitch.me/>)からご覧ください', inline: true })
       .setColor('#FFE201')
       .setTimestamp()
      await interaction.reply({ embeds: [embed] });
	},
};