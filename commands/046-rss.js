const { SlashCommandBuilder, ChannelType, Client, GatewayIntentBits , Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType } = require('@discordjs/voice');
const { get } = require('https');

// 音声URLからMP3ストリームを取得する関数
function getAudioStreamFromURL(url) {
  return new Promise((resolve, reject) => {
    get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`ステータスコード ${res.statusCode}`));
        return;
      }

      const contentType = res.headers['content-type'] || '';
      if (!contentType.startsWith('audio')) {
        reject(new Error(`音声ファイルではありません: Content-Type = ${contentType}`));
        return;
      }

      resolve(res); // HTTPS response をストリームとして扱う
    }).on('error', reject);
  });
}

// メイン再生関数
const playAudioInVoiceChannel = async (client, channelId, audioUrl) => {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || channel.type !== 2) {
      console.log(`チャンネル ${channelId} はボイスチャンネルではありません。`);
      return false;
    }

    if (channel.members.size === 0) {
      console.log(`チャンネル ${channelId} にメンバーがいないためスキップします。`);
      return false;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    console.log('ボイスチャンネルに接続中...');
    await entersState(connection, VoiceConnectionStatus.Ready, 30000);
    console.log(`チャンネル ${channelId} に接続しました。`);

    const player = createAudioPlayer();
    connection.subscribe(player);

    // Oddcastの音声URLからストリームを取得
    const stream = await getAudioStreamFromURL(audioUrl);
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

    player.play(resource);

    // 再生完了後に接続解除
    player.once(AudioPlayerStatus.Idle, () => {
      console.log(`音声再生が完了しました。チャンネル ${channelId} から退出します。`);
      connection.destroy(); // disconnect() ではなく destroy() の方が確実
    });

    return true;

  } catch (error) {
    console.error(`チャンネル ${channelId} での音声再生に失敗しました:`, error);
    return false;
  }
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,                  // サーバー管理に必要
    GatewayIntentBits.GuildMembers,            // メンバーの参加通知に必要
    GatewayIntentBits.GuildMessages,           // メッセージの受信に必要
    GatewayIntentBits.GuildMessageReactions, // メッセージのリアクションに必要
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.MessageContent           // メッセージ内容の読み取りに必要
  ],
  partials: [
    Partials.Message,   // メッセージの一部データにアクセスするために必要
    Partials.Channel,   // チャンネルの一部データにアクセスするために必要
    Partials.Reaction   // リアクションの一部データにアクセスするために必要
  ]
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const rss = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rss')
        .setDescription('RSS系機能の取得')
        .addStringOption(op =>
            op.setName('choice')
                .setDescription('選択してください')
                .addChoices(
                    { name: '334news', value: '334news', description: '334news' },
                    { name: 'quakeinfo', value: 'quakeinfo', description: 'quakeinfo' },
                    { name: 'delainfo', value: 'delainfo', description: 'delainfo' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('onoff')
                .setDescription('選択してください')
                .addChoices(
                    { name: 'on', value: 'on', description: 'on' },
                    { name: 'off', value: 'off', description: 'off' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('where')
                .setDescription('場所を選択してください')
                .addChoices(
                    { name: 'DM', value: 'DM', description: 'DM' },
                    { name: 'チャンネル', value: 'CH', description: 'チャンネル' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('word')
                .setDescription('絞り込み用の単語を入力')
                .setRequired(false)
        ),
    async execute(interaction) {
        
        await interaction.deferReply();

        const choice = interaction.options.getString('choice');
        const onoff = interaction.options.getString('onoff');
        const word = interaction.options.getString('word') || 'null';
        const where = interaction.options.getString('where');

        // choiceに基づいて適切なJSONファイルを読み込む
        const filePath = path.join(`${choice}.json`);
        let data = {};
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        if (onoff === 'on') {
            // 新しいwordを追加
            if (where === 'DM') {
                if (!data[interaction.user.id]) {
                    // interaction.user.idがまだ存在しない場合、初期化
                    data[interaction.user.id] = ['null'];
                }
                if (word !== 'null' && !data[interaction.user.id].includes(word)) {
                    if (data[interaction.user.id].includes('null')) data[interaction.user.id] = [word];
                    else data[interaction.user.id].push(word);
                } else if (word === 'null') {
                    data[interaction.user.id] = ['null'];
                }
                await interaction.editReply(`${choice}の通知をオンにしました`);
            } else if (where === 'CH') {
              if (rss === 1) {
                return await interaction.editReply('エラー 2024年9月16日 午前12時まで、この機能はご利用いただけません。');
              } else {
                if (!data[interaction.channel.id]) {
                    // interaction.channel.idがまだ存在しない場合、初期化
                    data[interaction.channel.id] = ['null'];
                }
                if (word !== 'null' && !data[interaction.channel.id].includes(word)) {
                    if (data[interaction.channel.id].includes('null')) data[interaction.channel.id] = [word];
                    else data[interaction.channel.id].push(word);
                } else if (word === 'null') {
                    data[interaction.channel.id] = ['null'];
                }
                if (interaction.channel.type === 2) {
                  const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=これは、文章読み上げのテスト放送です。&EXT=mp3`;
                  const success = await playAudioInVoiceChannel(client, interaction.channel.id, audioUrl);
                }
              await interaction.editReply(`${choice}の通知をオンにしました`);
              }
            }
        } else {
            // ユーザーまたはチャンネルのすべてのwordを削除
            if (where === 'DM') delete data[interaction.user.id];
            else if (where === 'CH') delete data[interaction.channel.id];
            await interaction.editReply(`${choice}の通知をすべて削除しました`);
        }

        // 更新されたデータをファイルに保存
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`${choice}.json : ${JSON.stringify(data)}`);
    }
};

client.login(process.env.logintoken);
