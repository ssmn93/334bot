const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// コマンドの実行
module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('BOT限定の「埋め込み」を生成します')
    .addStringOption(option =>
        option.setName('タイトル')
            .setDescription('タイトルを入力してください')
            .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('見出し1')
            .setDescription('最初の見出しを入力してください')
            .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('内容1')
            .setDescription('最初の内容を入力してください')
            .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('見出し2')
            .setDescription('2つ目の見出しを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('内容2')
            .setDescription('2つ目の内容を入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('見出し3')
            .setDescription('3つ目の見出しを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('内容3')
            .setDescription('3つ目の内容を入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('見出し4')
            .setDescription('4つ目の見出しを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('内容4')
            .setDescription('4つ目の内容を入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('見出し5')
            .setDescription('5つ目の見出しを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('内容5')
            .setDescription('5つ目の内容を入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('見出し6')
            .setDescription('6つ目の見出しを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('内容6')
            .setDescription('6つ目の内容を入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('サムネイル')
            .setDescription('サムネイルのURLを入力してください')
            .setRequired(false)
      )
      .addStringOption(option =>
        option.setName('画像')
            .setDescription('画像のURLを入力してください')
            .setRequired(false)
      ),
	async execute(interaction) {
        // メッセージ埋め込みを作成
      const title = interaction.options.getString('タイトル');
      const midash1 = interaction.options.getString('見出し1');
      const midash2 = interaction.options.getString('見出し2');
      const midash3 = interaction.options.getString('見出し3');
      const midash4 = interaction.options.getString('見出し4');
      const midash5 = interaction.options.getString('見出し5');
      const midash6 = interaction.options.getString('見出し6');
      const content1 = interaction.options.getString('内容1');
      const content2 = interaction.options.getString('内容2');
      const content3 = interaction.options.getString('内容3');
      const content4 = interaction.options.getString('内容4');
      const content5 = interaction.options.getString('内容5');
      const content6 = interaction.options.getString('内容6');
      let thumbnail;
      try {
        thumbnail = interaction.options.getString('サムネイル');
      } catch(error) {
        await interaction.reply('サムネイルURLの取得に失敗しました')
        return;
      }
      let picture;
      try {
        picture = interaction.options.getString('画像')
      } catch(error) {
        await interaction.reply('画像URLの取得に失敗しました')
        return;
      }
      let embed = new EmbedBuilder()
          .setTitle(title)
          .addFields(
              { name: midash1, value: content1, inline: true }
          )
          .setColor('#FFE201')
          .setTimestamp();
      try {
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (picture) embed.setImage(picture);
      } catch(error) {
        return await interaction.reply('サムネイル/画像の設定に失敗しました。URLが正しいか確認してください');
      }
      if (midash2 && content2) embed.addFields({ name: midash2, value: content2, inline: true });
      if (midash3 && content3) embed.addFields({ name: midash3, value: content3, inline: true });
      if (midash4 && content4) embed.addFields({ name: midash4, value: content4, inline: true });
      if (midash5 && content5) embed.addFields({ name: midash5, value: content5, inline: true });
      if (midash6 && content6) embed.addFields({ name: midash6, value: content6, inline: true });
      await interaction.reply({ embeds: [embed] });
      return;
	},
};