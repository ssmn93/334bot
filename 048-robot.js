const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,                  // サーバー管理に必要
    GatewayIntentBits.GuildMembers,            // メンバーの参加通知に必要
    GatewayIntentBits.GuildMessages,           // メッセージの受信に必要
    GatewayIntentBits.MessageContent           // メッセージ内容の読み取りに必要
  ],
  partials: [
    Partials.Message,   // メッセージの一部データにアクセスするために必要
    Partials.Channel,   // チャンネルの一部データにアクセスするために必要
  ]
});

client.login(process.env.logintoken);

//動作確認
module.exports = {
	data: new SlashCommandBuilder()
		.setName('robot')
		.setDescription('鬼畜ロボット画像生成')
    .addStringOption(op =>
            op.setName('content')
                .setDescription('ロボットに喋らせる内容を入力して下さい')
                .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const text = interaction.options.getString('content');

    const canvas = createCanvas(500, 500);
    const context = canvas.getContext('2d');
    const image = await loadImage('https://i.imgur.com/j1czY99.png');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.font = '30px Arial';
    context.fillStyle = 'black';

    const x = 100;
    let y = 175;
    const maxWidth = 400; // 文字列全体の最大幅
    const lineHeight = 40;

    wrapText(context, text, x, y, maxWidth, lineHeight);

    const buffer = canvas.toBuffer();
    const fileName = 'robot.png';
    try {
      fs.writeFileSync(fileName, buffer);
    } catch(error) {
      await interaction.editReply('エラーが発生しました。');
      console.log(error);
      return;
    }

    await interaction.editReply({ files: [fileName] });
    
    let server;
    if (interaction.guild) server = interaction.guild.name;
    else server = 'サーバー外';
    
    const Embed = new EmbedBuilder()
      .setTitle('/robot')
      .setThumbnail(interaction.user.avatarURL())
	    .addFields(
		    { name: 'ユーザー', value: `<@${interaction.user.id}>` },
		    { name: 'サーバー', value: server },
        { name: '内容', value: text }
	    );
    
    
    const channel = client.channels.cache.get('1264464045407211561');
    channel.send({ embeds: [Embed] });
    
    fs.unlinkSync(fileName);
  }
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const lines = [];
  let line = '';
  let lineLength = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isFullWidth = char.match(/[^\x00-\xff]/);
    const charLength = isFullWidth ? 2 : 1;

    if (lineLength + charLength > 18) { // 18は全角文字の2倍の長さと考える
      lines.push(line);
      line = '';
      lineLength = 0;
    }

    line += char;
    lineLength += charLength;
  }

  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, y + (i * lineHeight));
  }
}
