const Discord = require('discord.js');
const request = require("request");
const { Client, GatewayIntentBits, IntentsBitField, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
const Keyv = require('keyv');
const fs = require('fs');
const userId = process.env.admin;
// const blocked = JSON.parse(fs.readFileSync('blocked.json'));
client.login(process.env.logintoken);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('運営へのメッセージ送信')
        .addStringOption(option =>
          option.setName('choice')
            .setDescription('内容を選択してください')
            .setRequired(true)
            .addChoices(
              { name: '報告・質問', value: 'report' },
              { name: 'リクエスト', value: 'request' },
              { name: 'ad登録依頼', value: 'ad' },
              )
        )
        .addStringOption(option =>
            option.setName('content')
                .setDescription('内容を入力してください')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = await client.users.fetch(process.env.admin);
        // if (blocked[interaction.user.id]) {
        //   await interaction.reply('エラー /supportをご利用いただけません。');
        //   user.send(`ユーザー${interaction.user.tag}が/supportを利用しました。${interaction.user.avatarURL()}`);
        //   return;
        // }
        let content = interaction.options.getString('content');
        content = content.replace(/\\n/g, '\n');
        const username = interaction.user.username;
        const tag = interaction.user.discriminator;
        let choice = interaction.options.getString('choice');
        if (choice === 'report') choice = '報告・質問';
        if (choice === 'request') choice = 'リクエスト';
        if (choice === 'ad') choice = 'ad登録依頼';
        const fullUsername = `${username}#${tag}`;
        const timestamp = interaction.createdTimestamp;
        const date = new Date(timestamp); // Dateオブジェクトを作成
        const japanTime = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const embed = new EmbedBuilder()
          .setAuthor({ name: fullUsername, iconURL: interaction.user.avatarURL() })
          .setTitle('#' + choice)
          .setDescription(content)
          .setColor('#FFE201')
          .setTimestamp();
        user.send({ embeds: [embed] });
        await interaction.reply('メッセージの送信が完了しました');
            }
          }