const request = require("request");
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const isgd = require("isgd");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('url')
        .setDescription('URLを短縮します')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('短縮するURLを入力してください')
            .setRequired(true)
      ),
    async execute(interaction) {
      await interaction.deferReply();
      try {
        let urls;
        try {
          urls = interaction.options.getString('url');
        } catch(error) {
          await interaction.editreply('URLの取得に失敗しました');
          return;
        }
        isgd.shorten(urls, function (res) {
          interaction.editReply(res);
        });
	    } catch (error) {
        await interaction.editreply('短縮リンクの生成に失敗しました')
		    console.error(error);
	}
}
};