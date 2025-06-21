const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//動作確認
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('動作確認'),
	async execute(interaction) {
    await interaction.reply('日本シリーズをプレイ中');
	},
};