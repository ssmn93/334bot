const Discord = require("discord.js");
const { SlashCommandBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const Keyv = require('keyv');
const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.Message
  ]
});
client.login(process.env.logintoken);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('サーバー招待リンクの生成とBOTの招待リンク')
        .addStringOption(op =>
            op.setName('choice')
                .setDescription('server…サーバー招待リンク、bot…botの招待リンク')
                .addChoices(
                    { name: 'server', value: 'server' },
                    { name: 'bot', value: 'bot' }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const username = interaction.user.username;
        const tag = interaction.user.discriminator;
        const fullUsername = `${username}#${tag}`;
        if (choice == 'server') {
          try {
            const server = interaction.guild.id;
          } catch(error) {
            await interaction.reply('エラーが発生しました。サーバーで実行されているか確認して下さい。');
            return;
          }
          const invite = await interaction.channel.createInvite()
          const member = interaction.member;
          if (!interaction.inGuild()) {
            return interaction.reply({ content: 'このコマンドはサーバー内でのみ使用できます。', ephemeral: true });
          }
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
              interaction.reply({ content: '管理権限がないためリンクを生成できません', ephemeral: true });
              return;
          }
            await interaction.reply({ content: invite.url, ephemeral: true });
        } else if (choice == 'bot') {
          const userId = '1114542009802297474';
          const user = await client.users.fetch(userId);
          const username = interaction.user.username;
          const tag = interaction.user.discriminator;
          const fullUsername = `${username}#${tag}`;
          const timestamp = interaction.createdTimestamp;
          const date = new Date(timestamp); // Dateオブジェクトを作成
          const japanTime = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
          const send = fullUsername + 'が招待リンクを発行しました' + '\n' + japanTime
          await interaction.reply({ content: 'https://discord.com/oauth2/authorize?client_id=1127233136762298368&permissions=8&scope=bot+applications.commands', ephemeral: true });
          user.send(send);
        }
    },
};