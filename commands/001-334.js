const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//334
const arr334 = ['なんでや阪神関係ないやろ', 'な阪関無', 'https://cdn.discordapp.com/attachments/1121386494364483634/1181474226935443456/33-4___.gif'];
module.exports = {
	data: new SlashCommandBuilder()
		.setName('334')
		.setDescription('334'),
	async execute(interaction) {
    let autoreply = arr334[Math.floor(Math.random() * arr334.length)];
		await interaction.reply(autoreply);
	},
};