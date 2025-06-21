const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now')
        .setDescription('現在時刻の確認')
        .addStringOption(op =>
            op.setName('spot')
                .setDescription('地点')
                .addChoices(
                    { name: '東京', value: 'Tokyo' },
                    { name: 'ニューヨーク', value: 'NY' },
                    { name: '標準時', value: 'UTC'}
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const now = new Date();
        const choice = interaction.options.getString('spot');
      
        if (choice == 'Tokyo') {
          const tokyoTime = now.toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"});
          await interaction.reply(tokyoTime)
          
        } else if (choice == 'NY') {
          const nyTime = now.toLocaleString("en-US", {timeZone: "America/New_York"});
          await interaction.reply(nyTime);
          
        } else if (choice == 'UTC') {
          const utcTime = now.toISOString();
          await interaction.reply(utcTime)
          
        } else {
          await interaction.reply('選択が無効です。')
        }
    }
};