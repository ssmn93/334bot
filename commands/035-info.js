const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('サーバーの情報を表示します'),
  async execute(interaction) {
    await interaction.guild.members.fetch();
    await interaction.deferReply();
    try {
      // サーバーの情報を取得
      const memberCount = interaction.guild.memberCount; // サーバーのメンバー数
      // const onlineMembers = interaction.guild.members.cache.filter(member => member.presence && member.presence.status === "online"); // オンラインメンバーのみをフィルタリング
      const botsCount = interaction.guild.members.cache.filter(member => member.user.bot).size; // ボットの数
      const human = memberCount - botsCount;
      const serverName = interaction.guild.name; // サーバー名
      const serverIcon = interaction.guild.iconURL(); // サーバーのアイコン
      const member = memberCount + "人";
      const humans = human + "人";
      const onlineBotsCount = interaction.guild.members.cache.filter(member => member.presence && member.presence.status === "online" && member.user.bot).size; // オンラインのボットの数
      // const onlinemem = onlineMembers.size - onlineBotsCount; // オンラインのボットの数を引く
      // const online = onlinemem + "人";
      const bot = botsCount + "個";
      const serverCreateDate = interaction.guild.createdAt.toDateString();
      const owner = `<@${interaction.guild.ownerId}>`;
      const banner = interaction.guild.bannerURL({ format: 'png', size: 1024 });
      const boostLevel = interaction.guild.premiumTier;
      const boostLevels = String(boostLevel);
      const channelCount = String(interaction.guild.channels.cache.size);
      const roleCount = String(interaction.guild.roles.cache.size);

      // メッセージ埋め込みを作成
      const embed = new EmbedBuilder()
        .setTitle(serverName + 'について')
        .addFields(
          { name: 'メンバー', value: member, inline: true },
          { name: '人間', value: humans, inline: true },
          // { name: 'オンラインメンバー', value: online, inline: true },
          { name: 'ボット', value: bot, inline: true },
          { name: 'チャンネル数', value: channelCount, inline: true },
          { name: 'ロール数', value: roleCount, inline: true },
          { name: '最初のメッセージ', value: '検索中…', inline: true },
          { name: 'サーバー作成', value: serverCreateDate, inline: true },
          { name: 'ブーストレベル', value: boostLevels, inline: true },
          { name: '管理者', value: owner, inline: true }
        )
        .setColor('#FFE201')
        .setThumbnail(serverIcon)
        .setTimestamp();

      if (banner) embed.setImage(banner);

      // メッセージに埋め込みと最初のメッセージのURLを返信
      await interaction.editReply({ embeds: [embed] });
      
      // 最初のメッセージを取得
      const guild = interaction.guild;
      let earliestMessage = null;

      for (const channel of guild.channels.cache.values()) {
        if (channel.isTextBased()) {
          try {
            const messages = await channel.messages.fetch({ limit: 1, after: '0' });
            const firstMessage = messages.first();

            if (firstMessage && (!earliestMessage || firstMessage.createdTimestamp < earliestMessage.createdTimestamp)) {
              earliestMessage = firstMessage;
            }
          } catch (error) {
            console.error(`Failed to fetch messages from channel ${channel.id}:`, error);
          }
        }
      }
      
      // メッセージ埋め込みを作成
      const embed2 = new EmbedBuilder()
        .setTitle(serverName + 'について')
        .addFields(
          { name: 'メンバー', value: member, inline: true },
          { name: '人間', value: humans, inline: true },
          // { name: 'オンラインメンバー', value: online, inline: true },
          { name: 'ボット', value: bot, inline: true },
          { name: 'チャンネル数', value: channelCount, inline: true },
          { name: 'ロール数', value: roleCount, inline: true },
          { name: '最初のメッセージ', value: earliestMessage.url, inline: true },
          { name: 'サーバー作成', value: serverCreateDate, inline: true },
          { name: 'ブーストレベル', value: boostLevels, inline: true },
          { name: '管理者', value: owner, inline: true }
        )
        .setColor('#FFE201')
        .setThumbnail(serverIcon)
        .setTimestamp();

      if (banner) embed2.setImage(banner);

      // メッセージに埋め込みと最初のメッセージのURLを返信
      await interaction.editReply({ embeds: [embed2] });
    } catch (error) {
      console.error(error);
      if (interaction.guild) {
        await interaction.editReply('情報の取得に失敗しました。管理者に連絡し権限の不足がないかを確認してください。');
      } else {
        await interaction.editReply('情報の取得に失敗しました。サーバーではない場所で実行されている可能性があります。');
      }
    }
  },
};