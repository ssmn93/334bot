const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('review')
		.setDescription('最初のメッセージを取得'),
    async execute(interaction) {
      const message = interaction.channel.messages.fetch({ after: '0', limit: 1 }) // メッセージが送信されたチャンネルで一番最初に送信されたメッセージを取得する
      .then(messages => messages.first()) // コレクションからメッセージが送信されたチャンネルで一番最初に送信されたメッセージを取り出す
      .then(message => interaction.reply(message.url)) // コンソールへメッセージが送信されたチャンネルで一番最初に送信されたメッセージのURLをコンソールへ表示
	},
};