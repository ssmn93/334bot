const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, Partials, ChannelType, PermissionFlagsBits, ActivityType } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType } = require('@discordjs/voice');
const Discord = require("discord.js");
const cron = require('node-cron');
const Keyv = require('keyv');
require('dotenv').config();
const userIdnia = '958175221800636496';
const { get } = require('https');
const { createWriteStream } = require('fs');
// import { serve } from "@hono/node-server";
// import healthCheckServer from "./run.js";
// import { startHealthCheckCron } from "./cron.ts";

// serve({
//   fetch: healthCheckServer.fetch,
//   port: 8000,
// });
// startHealthCheckCron();

//よくわからないやつ
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,                  // サーバー管理に必要
    GatewayIntentBits.GuildMembers,            // メンバーの参加通知に必要
    GatewayIntentBits.GuildMessages,           // メッセージの受信に必要
    GatewayIntentBits.GuildMessageReactions, // メッセージのリアクションに必要
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.MessageContent,         // メッセージ内容の読み取りに必要
  ],
  partials: [
    Partials.Message,   // メッセージの一部データにアクセスするために必要
    Partials.Channel,   // チャンネルの一部データにアクセスするために必要
    Partials.Reaction   // リアクションの一部データにアクセスするために必要
  ]
});

const targetTime = new Date();
targetTime.setFullYear(2024);
targetTime.setMonth(7); // 7は8月を表します (0から始まるため)
targetTime.setDate(5);
targetTime.setHours(15);
targetTime.setMinutes(0);
targetTime.setSeconds(0);
client.once(Events.ClientReady, async () => {
    console.log(`日 本 シ リ ー ズ   開 幕`);
    let namep;

    if (yaju === 0) {
        if (saigai === 1) {
            client.user.setPresence({ activities: [{ name: '特別災害警戒措置' }], status: 'online' });
        } else if (niconico === 0 && saigai !== 1 && camp === 1) {
            client.user.setPresence({ activities: [{ name: '夏季キャンプ' }], status: 'online' });
        } else if (niconico === 0 && saigai !== 1 && camp !== 1  && offkai === 0) {
            client.user.setPresence({ activities: [{ name: 'Render環境での仮稼働中' }], status: 'online', type: ActivityType.Custom });
        } else if (niconico === 0 && saigai !== 1 && offkai === 1) {
            client.user.setPresence({ activities: [{ name: 'オフ会' }], status: 'online' })
        } else if (niconico === 1 && saigai !== 1) return;
    } else if (niconico === 0 && yaju !== 0) {
        namep = [
            { name: '8月10日は、おうちで淫夢。', type: ActivityType.Custom },
            { name: '野獣邸の参拝は控えましょう。', type: ActivityType.Custom },
            { name: '昏睡レイプ', type: ActivityType.Playing } // 「昏睡レイプをプレイ中」と表示
        ];

        let currentIndex = 0;
        setInterval(() => {
            client.user.setPresence({
                activities: [{ name: namep[currentIndex].name, type: namep[currentIndex].type }],
                status: 'online'
            });

            currentIndex = (currentIndex + 1) % namep.length;
        }, 11451); // 5秒ごとに変更
    }

    const filePath = path.join(__dirname, 'commands', 'timer.json');
    if (fs.existsSync(filePath)) {
        const { setTimer } = require('./commands/049-timer');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => setTimer(entry, client));
        console.log('タイマー設定完了');
    }
});
const RSSParser = require('rss-parser');
const parser = new RSSParser();

const fetchRSS = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.log(`Error fetching RSS feed of ${url} : ${error.message}`);
    return null;  // エラーが発生した場合、nullを返す
  }
};

const countdownDate = new Date('2024-08-05T15:00:00');

// client.once('ready', () => {
//   if (niconico !== 1) return;

//   // console.log(`Countdown date set to: ${countdownDate}`);

//   let countdownInterval;

//   const setStatusToNihonSeries = () => {
//     // console.log('Countdown ended, setting status to Nihon Series.');
//     client.user.setPresence({
//       activities: [{ name: 'ニコニコ復活おめでとう！！', type: ActivityType.Custom }],
//       status: 'online'
//     });
//   };

//   const updateCountdown = () => {
//     const now = new Date().getTime();
//     const distance = countdownDate.getTime() - now;

//     if (distance < 0) {
//       setStatusToNihonSeries();
//       clearInterval(countdownInterval);
//       return;
//     }

//     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     let countdownText;
//     if (distance <= 60 * 1000) {
//       countdownText = `${seconds}秒`;
//     } else {
//       countdownText = `${hours}時間 ${minutes}分`;
//     }

//     // console.log(`Updating status: ${countdownText}`);

//     client.user.setPresence({
//       activities: [{ name: `ニコニコ復旧あと ${countdownText}`, type: ActivityType.Custom }],
//       status: 'online'
//     });

//     clearInterval(countdownInterval);
//     if (distance <= 60 * 1000) {
//       countdownInterval = setInterval(updateCountdown, 1000);
//     } else {
//       countdownInterval = setInterval(updateCountdown, 60 * 1000);
//     }
//   };

//   // 最初に即座に更新
//   updateCountdown();
//   countdownInterval = setInterval(updateCountdown, 60 * 1000);
// });
const fs = require('node:fs');
const path = require('node:path');
let saigai = 0;
console.log(saigai);
let camp = 0;
let hikamani = 0;
let inm = 0;
let axonow = fs.readFileSync('axo.txt', 'utf8');
console.log(axonow);
let yaju = 0;
let niconico = 0;
let nico2;
let offkai = 0; 
let hinamasa = 1;
let wordh = 1;
console.log(niconico);

//ランダム返信
const arr = ['なんでや阪神関係ないやろ', 'な阪関無', 'https://cdn.discordapp.com/attachments/1121386494364483634/1181474226935443456/33-4___.gif'];
const arr2 = ['なんでや阪神関係ないやろ', 'な阪関無'];
const arr3 = ['過去と未来の狭間はまだ遠すぎて目には見えないものって🏡', '果てしなく続く空その先にあるものって🏡'];
const arrn = ['https://cdn.discordapp.com/attachments/1166698342319931416/1185536471420129320/image.png', 'https://cdn.discordapp.com/attachments/1166698342319931416/1185538366364717066/image.png', 'https://cdn.discordapp.com/attachments/1166698342319931416/1185538774692790302/image.png', 'https://cdn.discordapp.com/attachments/1166698342319931417/1185557700529106954/image.png', 'https://cdn.discordapp.com/attachments/1166698342319931417/1185557919098470420/image.png', 'https://cdn.discordapp.com/attachments/1166698342319931417/1185558086958723083/image.png', 'https://cdn.discordapp.com/attachments/1175683851746545694/1190156984331292733/image.png', 'https://cdn.discordapp.com/attachments/1175683851746545694/1190156984863952924/image.png', 'https://cdn.discordapp.com/attachments/1175683851746545694/1190156985333710948/image.png', 'https://cdn.discordapp.com/attachments/1175683851746545694/1190156985858019348/image.png'];

//あまね砲
const amn = '<@1038778326271139901>' + '\n' + 'すべてお前の自業自得だ。覚悟しろ。' + '\n' + '!mht' +  '\n' +  'https://cdn.discordapp.com/attachments/1121386494364483634/1154726306609639444/bf6a177e01a37e99.mp4' + '\n' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1155428597113298964/6.mp4' + '\n' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1154780585890427011/5.mp4'+'\n'+'https://media.discordapp.net/attachments/1121386494364483634/1169927012253704212/5000choyen_7.png';
const tsn = '# <@1128637676766117938>' + '\n' + 'https://cdn.discordapp.com/attachments/1246049856363954228/1246068139133894716/7a1907eec37dd09f.mp4?ex=665b0ae3&is=6659b963&hm=1e093a57b257d5fa2e2540905dd8e158c5329ceef897bd63e281cc1952a38e8d&' + '\n' + 'https://cdn.discordapp.com/attachments/1246049856363954228/1246073885170860142/5.mp4?ex=665b103d&is=6659bebd&hm=f28543aad4bf3e8f431e740928e5c62ad733554a4f9855904f83a1bfd0151912&' + '\n' + '!!tasen666';
const axoid = '617289553455349771';
const axo = `# <@${axoid}>` + '\n' + 'https://cdn.discordapp.com/attachments/1246049856363954228/1246068139133894716/7a1907eec37dd09f.mp4?ex=665b0ae3&is=6659b963&hm=1e093a57b257d5fa2e2540905dd8e158c5329ceef897bd63e281cc1952a38e8d&' + '\n' + 'https://cdn.discordapp.com/attachments/1246049856363954228/1246073885170860142/5.mp4?ex=665b103d&is=6659bebd&hm=f28543aad4bf3e8f431e740928e5c62ad733554a4f9855904f83a1bfd0151912&';
const tsnid = client.users.cache.get('1128637676766117938');

//Webview起動用
let http;
try {
  http = require('http');
} catch(error) {
  console.error(error);
}

const write = (
  '　　　ロ　阪' + '\n' +
  '第1戦 10 - 1' + '\n' +
  '第2戦 10 - 0' + '\n' +
  '第3戦 10 - 1' + '\n' +
  '第4戦  3 - 2' + '\n' +
  '合計　33 - 4'
);

// Webサーバーの起動とエラーハンドリング
let server;
try {
  server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(write);
    res.end();
  });
} catch(error) {
  console.error(error);
}

server.on('error', err => {
  console.log('Server error:', err);
});

try {
  server.listen(8080);
} catch(error) {
  console.error(error);
}

// ボットのログイン
client.login(process.env.logintoken);

//サーバー追加時
client.on('guildCreate', async guild => {
  // ここで指定したチャンネルIDにメッセージを送信します
      try {
        const memberCount = guild.memberCount; // サーバーのメンバー数
        // const onlineMembers = guild.members.cache.filter(member => member.presence && member.presence.status === "online"); // オンラインメンバーのみをフィルタリング
        const botsCount = guild.members.cache.filter(member => member.user.bot).size; // ボットの数
        const human = memberCount - botsCount;
        const serverName = guild.name; // サーバー名
        const serverIcon = guild.iconURL(); // サーバーのアイコン
        const member = memberCount + "人";
        const humans = human + "人";
        // const onlineBotsCount = guild.members.cache.filter(member => member.presence && member.presence.status === "online" && member.user.bot).size; // オンラインのボットの数
        // const onlinemem = onlineMembers.size - onlineBotsCount; // オンラインのボットの数を引く
        // const online = onlinemem + "人";
        const bot = botsCount + "個";
        const serverCreateDate = guild.createdAt.toDateString();
        const owner = `<@${guild.ownerId}>`;
        const banner = guild.bannerURL({ format: 'png', size: 1024 });
        const boostLevel = guild.premiumTier;
        const boostLevels = String(boostLevel);
        const channelCount = String(guild.channels.cache.size);
        const roleCount = String(guild.roles.cache.size);

        // メッセージ埋め込みを作成
        const embed = new EmbedBuilder()
            .setTitle(serverName + 'にBOTが追加されました')
            .addFields(
                { name: 'メンバー', value: member, inline: true },
                { name: '人間', value: humans, inline: true },
                // { name: 'オンラインメンバー', value: online, inline: true },
                { name: 'ボット', value: bot, inline: true },
                { name: 'チャンネル数', value: channelCount, inline: true },
                { name: 'ロール数', value: roleCount, inline: true },
                { name: 'サーバー作成', value: serverCreateDate, inline: true },
                { name: 'ブーストレベル', value: boostLevels, inline: true },
                { name: '管理者', value: owner, inline: true }
            )
            .setColor('#FFE201')
            .setThumbnail(serverIcon)
            .setTimestamp();
        if (banner) embed.setImage(banner);
        client.channels.cache.get("1226444245783806012").send({ embeds: [embed] });
      } catch(error) {
        console.error(error)
      }
});
client.on('guildDelete', async guild => {
  // ここで指定したチャンネルIDにメッセージを送信します
      try {
        const memberCount = guild.memberCount; // サーバーのメンバー数
        // const onlineMembers = guild.members.cache.filter(member => member.presence && member.presence.status === "online"); // オンラインメンバーのみをフィルタリング
        const botsCount = guild.members.cache.filter(member => member.user.bot).size; // ボットの数
        const human = memberCount - botsCount;
        const serverName = guild.name; // サーバー名
        const serverIcon = guild.iconURL(); // サーバーのアイコン
        const member = memberCount + "人";
        const humans = human + "人";
        // const onlineBotsCount = guild.members.cache.filter(member => member.presence && member.presence.status === "online" && member.user.bot).size; // オンラインのボットの数
        // const onlinemem = onlineMembers.size - onlineBotsCount; // オンラインのボットの数を引く
        // const online = onlinemem + "人";
        const bot = botsCount + "個";
        const serverCreateDate = guild.createdAt.toDateString();
        const owner = `<@${guild.ownerId}>`;
        const banner = guild.bannerURL({ format: 'png', size: 1024 });
        const boostLevel = guild.premiumTier;
        const boostLevels = String(boostLevel);
        const channelCount = String(guild.channels.cache.size);
        const roleCount = String(guild.roles.cache.size);

        // メッセージ埋め込みを作成
        const embed = new EmbedBuilder()
            .setTitle(serverName + 'からBOTが削除されました')
            .addFields(
                { name: 'メンバー', value: member, inline: true },
                { name: '人間', value: humans, inline: true },
                // { name: 'オンラインメンバー', value: online, inline: true },
                { name: 'ボット', value: bot, inline: true },
                { name: 'チャンネル数', value: channelCount, inline: true },
                { name: 'ロール数', value: roleCount, inline: true },
                { name: 'サーバー作成', value: serverCreateDate, inline: true },
                { name: 'ブーストレベル', value: boostLevels, inline: true },
                { name: '管理者', value: owner, inline: true }
            )
            .setColor('#FFE201')
            .setThumbnail(serverIcon)
            .setTimestamp();
        if (banner) embed.setImage(banner);

        client.channels.cache.get("1226444245783806012").send({ embeds: [embed] });
      } catch(error) {
        console.error(error)
      }
});

//スラッシュコマンド
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`${filePath} に必要な "data" か "execute" がありません。`);
  }
  }

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`${interaction.commandName} が見つかりません`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
        await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
        return;
    }
  }
});

//プーチンプリン
//client.on('ready', () => {
  //setInterval(() => {
//client.channels.cache.get("1166698342751948863").send('<@1102191604539859045>' + '\n' + 'すべてお前の自業自得だ。覚悟しろ。');
  //}, 1000 * 10);
//});

//黒電話
//client.on('ready', () => {
  //setInterval(() => {
//client.channels.cache.get("1201881490745720842").send('<@1118430717303607306>' + '\n' + "https://cdn.discordapp.com/attachments/1121386494364483634/1154780585890427011/5.mp4" + "\n" + "https://cdn.discordapp.com/attachments/1166698342319931416/1201871980131782686/SPOILER_Screenshot_2023-12-07_18.46.51.png?ex=65cb6581&is=65b8f081&hm=7dba6d94d04eb1b3673e5add6fe737d2fea5f4dc4126e91113a8bf4b343ce6d4&");
  //}, 1000 * 1);
//});

//黒電話2
//client.on('ready', () => {
  //setInterval(() => {
//client.channels.cache.get("1166698342751948862").send('<@1107938205031989272>' + '\n' + "https://cdn.discordapp.com/attachments/1211643756663803934/1211666346295951410/5_2.mp4" + "\n" + "https://cdn.discordapp.com/attachments/1211643756663803934/1211666822399787118/syazaisiro.png" + "\n" + "https://cdn.discordapp.com/attachments/1211643756663803934/1211669507786153984/Screenshot_2023-12-07_18.46.51.png" + "\n" + "334botへの暴言、無断転載と偽装、そして重曹鯖からの逃走か？ふざけんな" + "\n" + "# This bot has been fucked by Tsuruma & Gyausu!!!!!");
  //}, 1000 * 1);
//});

//norm
//client.on('ready', () => {
  //setInterval(() => {
//client.channels.cache.get("1201809765198729236").send('@everyone appdiscord.com/invite/etSUqf2r5q appdiscord.com/invite/86NmTRuXq6');
  //}, 1000 * 1);
//});

//fuma
//client.on('ready', () => {
  //if (nishid === 0) {
  //setInterval(() => {
//client.channels.cache.get("1214428797160521758").send('<@1154273801278849034>' + process.env.nishi);
  //}, 500 * 1);
  //}
//});

//334welcome
client.on('guildMemberAdd', (member, guild) => {
  if (member.id === axoid && member.guild.id === process.env.sugarG) {
    fs.writeFileSync('axo.txt', 'on');
  }
  const channel = member.guild.channels.cache.find(ch => ch.name === '334welcome');
  const channel2 = member.guild.channels.cache.find(ch => ch.name === '334log');
  const data = JSON.parse(fs.readFileSync('users.json'));
  if (!channel && !channel2) return;
  if (channel) {
    if (data[member.id]) {
      channel.send(`${member.user}が参加しました`)
      const user = client.users.fetch(process.env.admin);
      user.send(`${guild.name}に${member.user}が参加しました`)
    } else {
      channel.send(`${member.user}さん、ようこそ！`)
    }
  }
  if (channel2) {
  const logjs = JSON.parse(fs.readFileSync('log.json'));
  if (logjs[member.guild.id]) {
    if (!logjs[member.guild.id]) return;
    if (logjs[member.guild.id].every(pair => pair.choice !== 'join')) {
      return;
    }
    if (!channel2) return;
    const joinedTime = Math.floor(member.joinedTimestamp / 1000);
    const embed = new EmbedBuilder()
      .setTitle('参加ログ')
      .addFields({ name: '参加者', value: `<@${member.id}>`},
               { name: 'アカウント作成', value: `<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:d>(<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>)`}
              )
      .setColor('#FFE201')
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL());
      // logjs[member.guild.id].forEach(pair => {
      for (const pair of logjs[member.guild.id]) {
        // pair.choice が 'join' で、pair.mentions が存在する場合
        if (pair.choice === 'join' && pair.mentions) {
          channel2.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
        }
        // pair.choice が 'join' で、pair.mentions が存在しない場合
        else if (pair.choice === 'join') {
          channel2.send({ embeds: [embed] });
        }
      // });
      };
    if (data[member.id]) {
      const user = client.users.fetch(process.env.admin);
      user.send(`${guild.name}に${member.user}が参加しました`); 
    }
  }
  }
});

//334welcomeremove
client.on('guildMemberRemove', (member, guild) => {
  const channel = member.guild.channels.cache.find(ch => ch.name === '334welcome');
  const channel2 = member.guild.channels.cache.find(ch => ch.name === '334log');
  const data = JSON.parse(fs.readFileSync('users.json'));
  if (!channel && !channel2) return;
  if (channel) {
    if (data[member.id]) {
      channel.send(`${member.user}が退出しました`)
      const user = client.users.fetch(process.env.admin);
      user.send(`${guild.name}から${member.user}が退出しました`)
    } else {
      channel.send(`さようなら…${member.user}さんが退出しました。`)
    }
  }
  if (channel2) {
  const logjs = JSON.parse(fs.readFileSync('log.json'));
  if (logjs[member.guild.id]) {
    if (!logjs[member.guild.id]) return;
    let pair;
    if (logjs[member.guild.id].every(pair => pair.choice !== 'join')) {
      return;
    }
    if (!channel2) return;
    const joinedTime = Math.floor(member.joinedTimestamp / 1000);
    const embed = new EmbedBuilder()
      .setTitle('退出ログ')
      .addFields({ name: '退出者', value: `<@${member.id}>`},
               { name: 'アカウント作成', value: `<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:d>(<t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>)`},
               { name: 'サーバー参加', value: `<t:${joinedTime}:d>(<t:${joinedTime}:R>)`}
              )
      .setColor('#FFE201')
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL());
      logjs[member.guild.id].forEach(pair => {
        // pair.choice が 'join' で、pair.mentions が存在する場合
        if (pair.choice === 'join' && pair.mentions) {
          channel2.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
        }
        // pair.choice が 'join' で、pair.mentions が存在しない場合
        else if (pair.choice === 'join') {
          channel2.send({ embeds: [embed] });
        }
      });
    if (data[member.id]) {
      const user = client.users.fetch(process.env.admin);
      user.send(`${guild.name}から${member.user}が退出しました`); 
    }
  }
  }
});

//messageCreate
client.on('messageCreate', async message => {
  const data = JSON.parse(fs.readFileSync('users.json'));
  // const data1 = JSON.parse(fs.readFileSync('blocked.json'));
  const data2 = JSON.parse(fs.readFileSync('hikamani.json'));
  const data3 = JSON.parse(fs.readFileSync('inmu.json'));
  const data4 = JSON.parse(fs.readFileSync('guild.json'));
  const data5 = JSON.parse(fs.readFileSync('sec.json'));
  const data6 = JSON.parse(fs.readFileSync('channel.json'));
  const data7 = JSON.parse(fs.readFileSync('word.json'));
  const data8 = JSON.parse(fs.readFileSync('1stup.json'));
      
  const autoreply = arr[Math.floor(Math.random() * arr.length)];
  const autoreply2 = arr2[Math.floor(Math.random() * arr2.length)];
  const autoreply3 = arr3[Math.floor(Math.random() * arr3.length)];
  const autoreplyn = arrn[Math.floor(Math.random() * arrn.length)];
  let urls = String(message.content).match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g);
  if (data[message.author.id]) return;
  //if (data1[message.author.id] && message.author.id !== '1038778326271139901') return;
  if (message.guild) {
    if (data4[message.guild.id] || message.guild.id === process.env.guildm) return;
  }
  if (data6[message.channel.id]) return;
  if (message.author.bot) return;
  if (saigai === 1) return;
  if (message.channel.id !== process.env.announceM && message.channel.type === 5) return;
  if (message.channel.name === '334chat' || message.channel.name === '334info' || message.channel.name === '334close' || message.channel.name === '334dokuoya' || (message.channel.name === 'amnchat' && message.content.includes('!gchat')) || (message.channel.name === 'tsnchat' && message.content.includes('!gchat')) || (message.channel.name === 'usschat' && message.content.includes('!gchat'))) return;
  // JSONファイルに登録された文字列が含まれているかチェック
    if (data7[message.channel.id]) {
      for (let savedText of data7[message.channel.id]) {
        if (message.content.includes(savedText)) {
          return; // 特定の文字列が含まれていた場合、処理を終了
        }
      }
    } if (data7[message.author.id]) {
      for (let savedText of data7[message.author.id]) {
        if (message.content.includes(savedText)) {
          return; // 特定の文字列が含まれていた場合、処理を終了
        }
      }
    } if (data7[message.guild.id]) {
      for (let savedText of data7[message.guild.id]) {
        if (message.content.includes(savedText)) {
          console.log('あ');
          return; // 特定の文字列が含まれていた場合、処理を終了
        }
      }
    }
  
  // if (wordh === 0 || data8[message.guild.id]) {
  //334
  if (message.content.includes('334')) {
    if (message.content.includes('なんでや阪神関係ないやろ')) return;
    if (!message.content.includes('<@') && !message.content.includes('>')) {
      try {
        message.channel.send(autoreply);
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    }
    
    //なんでや阪神関係あるやろ  
  } if (message.content.includes('なんでや阪神関係ないやろ')) {
    try {
      message.channel.send('なんでや阪神関係あるやろ');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
    
  //阪神
  } if (message.content.includes('33-4') || message.content.includes('阪神') || message.content.includes('ロッテ') || message.content.includes('甲子園') || message.content.includes('アレ') || message.content.includes('A.R.E.') || message.content.includes('道頓堀')) {
    if (message.content.includes('淡路') || (message.content.includes('なんでや阪神関係ないやろ'))) return;
    try {
      message.channel.send(autoreply2);
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //な阪関無
  } if (message.content.includes('な阪関無')) {
    try {
      message.channel.send('な阪関有');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //114514
  } if (message.content.includes('114514') || message.content.includes('1919') || message.content.includes('810')) {
    // if (data3[message.author.id]) return;
    if (inm === 1) return;
    if (!message.content.includes('<@') && !message.content.includes('>')) {
      try {
        message.channel.send('イキスギィ！');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    }

  //下北沢
  } if (message.content.includes('下北沢') || message.content.includes('野獣邸') || message.content.includes('東北沢') || message.content.includes('北沢')) {
    // if (data3[message.author.id]) return;
    if (inm === 1) return;
    try {  
      message.channel.send('こ↑こ↓');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //渋谷
  } if (message.content.includes('渋谷') || (message.content.includes('ロフト'))) {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
    try {
      message.channel.send('https://cdn.discordapp.com/attachments/1166698342319931419/1183696422915293204/Hikakin_Mania.mp4');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
    
  //屋上
  } if (message.content.includes('屋上') || (message.content.includes('焼く'))) {
    // if (data3[message.author.id]) return;
    if (inm === 1) return;
    try {
      message.channel.send('まずうちさぁ、屋上…あんだけど。')
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //いいね
  } if (message.content.includes('いいね')) {
    // if (data3[message.author.id]) return;
    if (inm === 1) return;
    try {
      message.channel.send('あぁ〜^いいっすねぇ〜^')
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //そうだよ(便乗)
  } if (message.content.includes('そうだよ(便乗)')) {
    // if (data3[message.author.id]) return;
    if (inm === 1) return;
    try {
      message.channel.send('おっ、そうだな')
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //7095110
  } if (message.content.includes('7095110') || message.content === '128') {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
    if (!message.content.includes('<@') && !message.content.includes('>')) {
      try {
        message.channel.send('ゲッ、ヒカマーかよ…');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    }

  //泣く
  } if (message.content.includes('泣く') || message.content.includes('泣き虫') || message.content.includes('殴虫')) {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
    try {
      message.channel.send('https://cdn.discordapp.com/attachments/1166698342319931416/1200449314154086440/cade1a669dc5722f.mp4');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  // //12660
  // } if (message.content.includes('12660')) {
  //   if (!message.content.includes('<@') && !message.content.includes('>')) {
  //     try {
  //       message.channel.send('校長を固有名詞にした男');
  //     } catch(error) {
  //       console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
  //     }
  //   }

  //草
  } if (message.content.includes('草')) {
    try {
        message.reply('草生えすぎて東京都多摩市貝取5-3(?)');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }

  //ビッグモーター
  } if (message.content.includes('ビッグモーター')) {
    try {
      message.reply('株式会社ビッグモーター（英語: BIGMOTOR Co., Ltd. ）は、東京都多摩市貝取5-3に本社を置く中古車販売・買取会社。元代表取締役社長の兼重宏行が、出身地の山口県岩国市で創業。販売から買取・車検・修理・板金塗装・損害保険・リースなど、自動車に関するサービスすべてに対応する「ワンストップショッピング型」の店舗を全国で展開し、2023年5月現在、従業員数6000名、全国300店舗以上を抱える。公式ウェブサイトでは「買取台数6年連続日本一」とアピールしている。キャッチフレーズは「やっぱりビッグが一番」。帝国データバンクの発表によれば、2022年度の中古車業界の中でビッグモーターの売上高ベースのシェアは約15%でトップ。なお、2023年7月時点で全ての株式を兼重一族の資産管理会社である株式会社ビッグアセット（本社：東京都港区六本木1丁目9番18号、代表取締役：兼重宏行）が所有していると報じられている。CMキャラクターには、俳優の西村雅彦、スタッフ出演のCMを経て、大森南朋や佐藤隆太が起用されていたが、不祥事を受け放送中止が通知された。');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //教育
  } if (message.content.includes('教育') || message.content.includes('死刑')) {
    try {
      message.channel.send('大変申し訳御座いません。厳しく改善指導致します。' + '\n' + '大変申し訳御座いません。即指導致します。' + '\n' + '大変申し訳御座いません。指導徹底致します。');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //姫路
  } if (message.content.includes('姫路')) {
    try {
      message.channel.send('何度もチャンスを頂いているにも関わらず、大変申し訳御座いません。');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  // //伊藤忠
  // } if (message.content.includes('伊藤忠')) {
  //   try {
  //     message.channel.send('ビッグモーター買収感謝(ありがとうございます)');
  //   } catch(error) {
  //     console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
  //   }
    
  // } if (message.content.includes('WECARS')) {
  //   try {
  //     message.channel.send('ありがとうビッグモーター');
  //   } catch(error) {
  //     console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
  //   }

  //吉野家
  } if (message.content.includes('吉野家')) {
      try {
        message.reply(`
昨日、近所の吉野家行ったんです。吉野家。
そしたらなんか人がめちゃくちゃいっぱいで座れないんです。
で、よく見たらなんか垂れ幕下がってて、１５０円引き、とか書いてあるんです。
もうね、アホかと。馬鹿かと。`);
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    
  //ハゲ
  } if (message.content.includes('金欠')) {
    try {
      message.reply('>116 ジュース飲んでんじゃねーよハゲ！！');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //なんでそんなこと言うんだ？
  } if (message.content.includes('帰れ')) {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
    try {
      message.reply('https://cdn.discordapp.com/attachments/1166698342319931416/1183060848269332531/image.png');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //なんでそんなことで謝るんだ？
  } if (message.content.includes('ごめん') || message.content.includes('すまん')) {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
    try {
      message.reply('https://cdn.discordapp.com/attachments/1173094647866871868/1183063336926068807/image.png');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
    
  } if (message.content.includes('おやすみ')) {
    try {
      message.reply('https://cdn.discordapp.com/attachments/1166698342319931420/1224251337416507434/See_you_next_time..mp4')
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`)
    }

  //おやすみ
  } if (message.content.includes('おはよう')) {
      try {
        message.reply('おはようございます(津田英治)');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }

  //hikakinTVで
  } if (message.content.includes('あなる')) {
    // if (data2[message.author.id]) return;
    if (hikamani === 1) return;
      try {
        message.channel.send('hikakinTVでケツの穴とか言ったことあんまないけどw')
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }

  // //今
  // } if (message.content.includes('今')) {
  //   // if (data2[message.author.id]) return;
  //   if (message.content.includes('今日')) return;
  //   if (hikamani === 1) return;
  //       try {
  //         message.reply('過去と未来の狭間って🏡');
  //       } catch(error) {
  //         console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
  //       }

  //夢
  } if (message.content.includes('淫夢')) {
      // if (data3[message.author.id]) return;
      if (inm === 1) return;
      try {
        message.reply('イキスギィ！')
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
      
  //長浜田舎
  } if (message.content.includes('バルス')) {
    try { 
      message.channel.send('https://media1.tenor.com/m/1YCjylG1VtUAAAAC/castle-in-the-sky-spell-of-destruction.gif');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
    
  } if (message.content.includes('長浜')) {
    if (!message.guild || message.guild.id !== '1166698341212618843') return;
          try {
            message.channel.send(autoreplyn);
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }
  
  //過疎
  } if (message.content.includes('過疎')) {
    try { 
      message.channel.send('バッチェ冷えてますよ〜');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
  }
  
  //カブトムシ
  // } if (message.content.includes('螺旋階段、カブトムシ')) {
  //   if (!message.guild || message.guild.id !== '1166698341212618843') return;
  //     try {
  //       message.channel.send('そんなコマンドないで。');
  //     } catch(error) {
  //       console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
  //     }

  //tntn
  //} else if (message.content.includes('!tntn on')) {
    //if (!message.guild || message.guild.id !== '1074629113228300321') return;
    //try {
      //tntn = 0
      //message.reply('反応をオンにしました')
    //} catch(error) {
      //console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    //}
    
  //} else if (message.content.includes('!tntn off')) {
    //if (!message.guild || message.guild.id !== '1074629113228300321') return;
    //try {
      //tntn = 1
      //message.reply('反応をオフにしました')
    //} catch(error) {
      //console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    //}

  //phone
  // } 
  // }
});

function containsURL(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return urlRegex.test(message.content);
}

//草bot
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const datau = fs.readFileSync('ushi.txt', 'utf8');
  const dataFilePath = 'reply.json';
  const loadData = () => {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
  };
  const loadDatap = () => {
    if (!fs.existsSync('password.json')) {
      fs.writeFileSync('password.json', JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync('password.json'));
  };
  const passwordFilePath = loadDatap();
  let datar = loadData();
  if ((message.guild && datar[message.guild.id])) {
        for (const pair of datar[message.guild.id]) {
            if (message.content.includes(pair.from)) {
                message.reply(pair.to);
            }
        }
  } if (message.channel.id === '1246681769365733460') {
    if (message.author.bot) return;
    if (!message.content.includes('!auto') && datau === 'on') message.channel.send('おん');
    if (message.content === '!auto on') {
      fs.writeFileSync('ushi.txt', 'on');
    } else if (message.content === '!auto off') {
      fs.writeFileSync('ushi.txt', 'off');
    }
    
  } else if (((message.channel.type === ChannelType.DM || message.channel.type === ChannelType.GroupDM) && datar[message.author.id])) {
      for (const pair of datar[message.author.id]) {
            if (message.content.includes(pair.from)) {
                message.reply(pair.to);
            }
        }
  } 
  if (message.content.includes('phone')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
        try {
          await message.reply('phone=ふーん');
        } catch(error) {
          console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
        }

  //メンション
  }if (message.content.includes(`<@${client.user.id}>`)) {
    if (message.guild &&  message.guild.id === '1074629113228300321') {
      if (hinamasa === 1) return;
      try {
        const user = message.author.id
        message.channel.send('<@' + user + '>、いかがなさいましたか？');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    } else {
      try {
        message.reply('呼んだ？呼んだよね？今呼んだよね？');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    }

  //青梅
  }if (message.content.includes('青梅')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
        try {
          await message.reply('青梅=おめでとう');
        } catch(error) {
          console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }

  //蘇我氏
  }if (message.content.includes('蘇我氏')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('蘇我氏=忙しい');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          } 

  //BIG栗
  }if (message.content.includes('BIG栗')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
    try {
      await message.reply('BIG栗=びっくり');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
    
  }if (message.content.includes('big栗')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
    try {
      await message.reply('big栗=びっくり');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //出汁蟹
  }if (message.content.includes('出汁蟹')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
    try {
      await message.reply('それはただのカニスープ');
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }

  //っっでやねん
  }if (message.content.includes('っっでやねん')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('っっでやねん=なんでやねん');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }

  //小田急小田原線
  }if (message.content.includes('小田急小田原線')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('小田急小田原線=OH');
        } catch(error) {
          console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
        }

  //養老
  }if (message.content.includes('養老')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('養老=よろしく');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }

  //ん
  }if (message.content === 'ん') {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('ん=うん');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }

  //谷保
  } if (message.content.includes('谷保')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('谷保=やっほー');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }
    
  //四天王
  } if (message.content.includes('四天王')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('四天王=〜してるの？');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }

  //お葉葉
  } if (message.content.includes('お葉葉')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
          try {
            await message.reply('お葉葉=おはよう');
          } catch(error) {
            console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
          }

  //巣子
  } if (message.content.includes('巣子')) {
    if (!message.guild || message.guild.id !== '1074629113228300321' || hinamasa === 1) return;
        try {
          await message.reply('それはIGR');
        } catch(error) {
          console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
        }
  
  }
  const dataa = JSON.parse(fs.readFileSync('afk.json'));
  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach(mentionedUser => {
        if (dataa[mentionedUser.id]) {
            // 登録されたメッセージを返す
            message.channel.send(`${mentionedUser}はAFKを適用中です: 「${dataa[mentionedUser.id]}」`);
            // console.log(dataa);
        }
    });
  } if (dataa[message.author.id]) {
        message.channel.send(`AFK「${dataa[message.author.id]}」を削除しました`);
        delete dataa[message.author.id];
        fs.writeFileSync('afk.json', JSON.stringify(dataa, null, 2));
        // console.log(dataa);
    }

  //ちんちんbot
   //else {
    //if (message.author.id === "1072843593770872892") {
      //if (tntn === 1) return;
      //if (!message.guild || message.guild.id !== '1074629113228300321') return;
        //try {
          //message.channel.send("ちんちん")
        //} catch(error) {
          //console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
        //}
    if (message.author.id === "1038778326271139901") {
      message.reply("https://cdn.discordapp.com/attachments/1121386494364483634/1154780585890427011/5.mp4" + "\n" + "https://cdn.discordapp.com/attachments/1166698342319931416/1201871980131782686/SPOILER_Screenshot_2023-12-07_18.46.51.png?ex=65cb6581&is=65b8f081&hm=4126e91113a8bf4b343ce6d4&")
    }
  if (message.channel && message.channel.name && message.channel.name.includes('334grass')) {
    // const data = JSON.parse(fs.readFileSync('users.json'));
    // const data1 = JSON.parse(fs.readFileSync('blocked.json')); 
    // if (data[message.author.id]) return;
    // if (data1[message.author.id]) return;
    if (message.author.bot) return;
    const now = new Date();
    const formattedNow = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const date = now.getDate();
    if (date % 2 === 1) {
      try {
        message.channel.send('草');
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
      }
    } else {
      try {
        message.channel.send('草を通り越して木が生え、林になり森が芽生え生態系が確立されそこに多くの歴史が展開された。後の世界樹である。')
      } catch(error) {
        console.error(`${message.guild.name}にてエラーが発生しました: ${error}`)
      }
    }
  } if (message.channel && message.channel.name && message.channel.name.includes("334otsu")) {
    if (message.author.bot) return;
    // const data = JSON.parse(fs.readFileSync('users.json'));
    // const data1 = JSON.parse(fs.readFileSync('blocked.json'));
    // if (data[message.author.id]) return;
    // if (data1[message.author.id]) return;
    if (message.author.id === "1107938205031989272") return;
    try {
      message.channel.send("おつ");
    } catch(error) {
      console.error(`${message.guild.name}にてエラーが発生しました: ${error}`);
    }
  // }   if (message.content === process.env.nishitetsu) {
  //   const member = message.member;
  //   if (message.guild && message.guild.id === "1215531187771277322") {
  //     if (message.channel.id === process.env.channel) {
  //       const role = message.guild.roles.cache.get('1215591504589094932'); // ロールのIDを指定
  //       member.roles.add(role).catch(console.error);
  //       message.delete();
  //       const mesO = await message.channel.send(`${member.user.username}さんにロールを付与しました`);
  //       await wait(5000);
  //       await mesO.delete();
  //     }
  //   }
//   } else if (regex_create.test(message.content)) {
//       const matches = message.content.match(regex_create);
//       const name = matches[1];
      
//       try {
//         const newChannel = await message.guild.channels.create({
//             name: name, // チャンネル名
//             type: 0, // テキストチャンネルのタイプ（GUILD_TEXT）
//             parent: process.env.parent, // カテゴリIDを指定
//         });
//         const success = await message.reply(`チャンネルを作成しました: <#${newChannel.id}>`);
//         await wait(5000);
//         try {
//           await success.delete();
//         } catch(error) {
//           return;
//         }
//       } catch(error) {
//         console.log(error);
//         await client.channels.cache.get(process.env.staffonly).send(error);
//         const errorm = await message.reply('チャンネルの作成ができませんでした。');
//         await wait(5000);
//         try {
//           await errorm.delete();
//         } catch(error) {
//           return;
//         }
//       }
  
  } if (message.guild.id === process.env.guildm) {
      if (message.author.bot) return;
      if (message.channel.id !== process.env.staffm && message.channel.id !== '1259767021533396992' && message.channel.id !== '1335897207760748547') {
      if (message.channel.parent.id !== "1296739945402339350" && message.channel.parent.id !== "1259766074052706396") {
      message.channel.send(message.content);
      const embed = new EmbedBuilder()
            .setTitle('anonymousM')
            .addFields(
                { name: 'author', value: `<@${message.author.id}>`, inline: true },
                { name: 'content', value: String(message.content), inline: true}
            )
            .setColor('#FFE201')
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
      client.channels.cache.get(process.env.anonymousM).send({ embeds: [embed] });  
      message.delete();
      }
      }
  } if (message.channel.name.startsWith('334chat')) {
    if (message.author.bot) return;
    // let data;
    // try {
    //     data = JSON.parse(fs.readFileSync('users.json'));
    // } catch (err) {
    //     data = {};
    // }
    // if (data[message.author.id]) return;
    // let data1;
    // try {
    //   data1 = JSON.parse(fs.readFileSync('blocked.json'));
    // } catch(err) {
    //   data1 = {};
    // }
    // if (data1[message.author.id]) return;
    if (message.author.id === "1127233136762298368") return;
    let content;
    if (message.reference) {
      const repliedMessageId = message.reference.messageId;
      const repliedMessage = await message.channel.messages.fetch(repliedMessageId);
      if (repliedMessage.embeds.length > 0) {
        const match = repliedMessage.embeds[0].description.match(/^> .*\n(.+)/s);
        const extractedText = match ? match[1] : repliedMessage.embeds[0].description;
        const firstLine = extractedText.split('\n')[0];
        content = `> ${firstLine}\n${message.content}`;
      } else {
        const firstLine = repliedMessage.content.split('\n')[0];
        content = `> ${firstLine}\n${message.content}`;
      }
    } else {
      content = message.content;
    }
    if (!message.attachments.size) await message.delete();
    let url = message.author.displayAvatarURL();
    const author = { name: message.author.tag, iconURL: url };
    const footer = { text: message.guild.name, iconURL: message.guild.iconURL() };
    for (const channel of client.channels.cache.values()) {
      if (channel.name !== message.channel.name) continue;
      if (message.content) {
        const embed = new EmbedBuilder()
          .setAuthor(author)
          .setDescription(content)
          .setColor('#FFE201')
          .setFooter(footer)
          .setTimestamp();
        try {
          await channel.send({ embeds: [embed] });
        } catch(error) {
          console.log(error);
          console.log(channel.id);
          continue;
        }
      }
      for (const attachment of message.attachments.values()) {
        const embed = new EmbedBuilder()
          .setAuthor(author)
          .setImage(attachment.url)
          .setDescription(attachment.url)
          .setColor('#FFE201')
          .setFooter(footer)
          .setTimestamp();
        const imageUrl = attachment.url;
        try {
          if (imageUrl.includes('jpeg') || imageUrl.includes('JPEG') || imageUrl.includes('jpg') || imageUrl.includes('JPG') || imageUrl.includes('gif') || imageUrl.includes('GIF') || imageUrl.includes('png') || imageUrl.includes('PNG') || imageUrl.includes('webp') || imageUrl.includes('WEBP')) await channel.send({ embeds: [embed] });
          else await channel.send(imageUrl);
        } catch(error) {
          continue;
        }
        }
      }
  }
  
    if (message.author.id === '1127233136762298368') return;
    const datal = JSON.parse(fs.readFileSync('lock.json', 'utf8'));
    const entry = datal.find(item => item.chid === message.channel.id);

    if (entry) {
      try {
        const oldMessage = await message.channel.messages.fetch(entry.msid);
        if (oldMessage) await oldMessage.delete(); // 既存の埋め込みメッセージを削除
      } catch (error) {
        console.error(`メッセージの削除に失敗しました: ${error}`);
      }

    const embed = new EmbedBuilder()
      .setAuthor({ name: entry.name, iconURL: entry.icon })
      .setDescription(entry.content)
      .setColor('#FFE201')
      .setTimestamp();

    const newMessage = await message.channel.send({ embeds: [embed] });

    // 新しいメッセージIDを更新
    entry.msid = newMessage.id;
    fs.writeFileSync(path.join('lock.json'), JSON.stringify(datal));
  }
  
    const datas = JSON.parse(fs.readFileSync('sec.json'));
    if ((datas && message.guild && message.guild.id && datas[message.guild.id])) {
        const ngWords = datas[message.guild.id];
        let embedSent = false; // Flag to track if an embed was already sent

        for (const entry of ngWords) {
            const { word, place, id } = entry;
            if (place === message.channel.id || place === message.guild.id) {
                if (message.author.id === '1127233136762298368') return;

                const wordsList = datas[message.guild.id].map(entry => entry.word);
                const containsWord = wordsList.some(word => message.content.includes(word));
                if (!containsWord) return;
                const member = await message.guild.members.fetch(message.author.id);
                if (member.roles.cache.some(role => role.name === `allowed_sec_${id}`)) return;

                if (!embedSent) { // Only proceed if no embed has been sent yet
                    const channels = message.guild.channels.cache;
                    const targetChannel = channels.find(channel => channel.name.startsWith('334sec-'));
                    const targetChannels = channels.find(channel => channel.name === "334sec");
                    const avatarURL = message.author.avatarURL();
                    const member = await message.guild.members.fetch(message.author.id);

                    const embed = new EmbedBuilder()
                        .addFields(
                            { name: 'ユーザー', value: `<@${message.author.id}>`, inline: true },
                            { name: 'リンク', value: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`, inline: true },
                        )
                        .setColor('#FFE201')
                        .setThumbnail(avatarURL)
                        .setTimestamp();

                    const embedc = new EmbedBuilder()
                        .setTitle(`ユーザー${message.author.tag}がタイムアウトされました`)
                        .addFields(
                            { name: 'リンク', value: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`, inline: true },
                            { name: '理由', value: `ブロックされた単語「${word}」の使用`, inline: true },
                        )
                        .setColor('#FFE201')
                        .setThumbnail(avatarURL)
                        .setTimestamp();

                    if (targetChannel) {
                        let second;
                        let display;
                        const match_d = targetChannel.name.match(/-(\d+)day/);
                        console.log(match_d);
                        const match_h = targetChannel.name.match(/-(\d+)hour/);
                        const match_m = targetChannel.name.match(/-(\d+)minute/);
                        const match_s = targetChannel.name.match(/-(\d+)second/);
                        if (match_d) {
                          second = Number(match_d[1] * 86400000);
                          display = match_d[1] + '日';
                        } else if (match_h) {
                          second = Number(match_h[1] * 3600000);
                          display = match_h[1] + '時間';
                        } else if (match_m) {
                          second = Number(match_m[1] * 60000);
                          display = match_m[1] + '分';
                        } else if (match_s) {
                          second = Number(match_s[1] * 1000);
                          display = match_s[1] + '秒';
                        }
                        
                        embed.setTitle('334sec 警告');
                        let timea;
                        try {
                            await member.timeout(second, '334sec');
                            embed.addFields({ name: 'タイムアウト', value: '成功', inline: true });
                            timea = true;
                        } catch (error) {
                            embed.addFields({ name: 'タイムアウト', value: '失敗', inline: true });
                            timea = false;
                        }
                        targetChannel.send({ embeds: [embed] });
                        if (timea === true) {
                            embedc.addFields({ name: 'タイムアウト', value: display, inline: true });
                            message.channel.send({ embeds: [embedc] });
                        }
                    } else if (targetChannels) {
                        embed.setTitle('334sec 警告');
                        embed.addFields({ name: 'タイムアウト', value: 'なし', inline: true });
                        targetChannel.send({ embeds: [embed] });
                    }

                    embedSent = true; // Set flag to true after sending the embed
                }

                break; // Exit the loop after sending the embed
            }
        }
    }  if (message.guild.id === '1166698341212618843' && message.author.id === '553841194699063319' && message.content.includes('みんなで歓迎しましょう！！')) {
      message.channel.send(`<@&1166698341212618847>`);
    } if (passwordFilePath[message.channel.id]) {
  // console.log('あ');
  let item = passwordFilePath[message.channel.id];
  
  for (const entry of item) {
    if (message.content === entry.password) {
      // console.log('い');
      const member = message.member;
      const role = message.guild.roles.cache.get(entry.roleId);

      if (role) {
        // console.log('う');
        member.roles.add(role).catch(console.error);
        message.delete();
        const mes = await message.channel.send(`${member.user.username}さんにロールを付与しました`);
        await wait(5000);
        await mes.delete();
      }
    }
  }
}
    // } if (message.guild.id === '1166698341212618843' && message.author.id === '761934840291131392') {
    //   const txt = fs.readFileSync('txt.txt', 'utf8');
    //   if (txt === 'on') {
    //     try {
    //     await message.react('🤔');
    //     await message.react('<:medikara:1315559954358468628>');
    //     await message.react('<:810:1217121852074233997>');
    //     await message.react('❗');    // シンプルな感嘆符
    //     await message.react('✨');    // きらめき
    //     await message.react('🤟');    // I Love You ジェスチャー
    //     await message.react('👍');    // いいね！
    //     await message.react('⚡');    // シンプルな雷
    //     await message.react('🙌');    // バンザイ
    //     await message.react('🥓');    // ベーコン
    //     await message.react('🥩');    // 肉の塊
    //     await message.react('🍗');    // 鳥の足
    //     await message.react('🍖');    // 骨付き肉
    //     await message.react('😋');    // 美味しい顔
    //     await message.react('🍴');    // フォークとナイフ
    //     await message.react('🙏');    // 合掌
    //     await message.react('🌟');    // 光る星
    //     await message.react('💥');    // 爆発
    //     await message.react('👉');    // 右を指さす
    //     await message.react('😁');    // にっこり笑顔 
    //     } catch(error) {
    //       return;
    //     }
    //   }
    // } if (message.content === '!txt on' && message.guild.id === '1166698341212618843') {
    //   fs.writeFileSync('txt.txt', 'on');
    //   message.reply('反応をオンにしました');
    // } else if (message.content === '!txt off' && message.guild.id === '1166698341212618843') {
    //   fs.writeFileSync('txt.txt', 'off');
    //   message.reply('反応をオフにしました');
    // }
  });

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.name === "334otsu") {
    const data = JSON.parse(fs.readFileSync('users.json'));
    // const data1 = JSON.parse(fs.readFileSync('blocked.json'));
    if (data[user.id]) return;
    // if (data1[user.id]) return;
      try {
          reaction.message.channel.send('おつ');
      } catch(error) {
        console.error(`${reaction.guild.name}にてエラーが発生しました: ${error}`);
      }
  }
  const datas = JSON.parse(fs.readFileSync('sec_reaction.json'));
    if ((datas && reaction.message.guild && reaction.message.guild.id && datas[reaction.message.guild.id])) {
        const ngWords = datas[reaction.message.guild.id];
        let embedSent = false; // Flag to track if an embed was already sent

        for (const entry of ngWords) {
            const { word, place, id } = entry;
            if (place === reaction.message.channel.id || place === reaction.message.guild.id) {
        // console.log('あ');
                if (user.id === '1127233136762298368') return;

                const wordsList = datas[reaction.message.guild.id].map(entry => entry.word);
                const containsReaction = wordsList.some(ngReaction => {
                // カスタム絵文字（例：<:welcome:1112360301665452135>）の場合
                if (reaction.emoji.id) {
                  return ngReaction === `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
                }
                // 通常の絵文字（例：🤬）の場合
                return ngReaction === reaction.emoji.name;
                });
                if (!containsReaction) { console.log('りたーん'); return; }
              
              
                if (reaction.message.partial) {
                  await reaction.message.fetch(); // フェッチして完全なメッセージデータを取得
                }
              
                console.log(embedSent);
                const member = await reaction.message.guild.members.fetch(user.id);
                if (member.roles.cache.some(role => role.name === `allowed_secr_${id}`)) { console.log('あ'); return; }
                const membered = await reaction.message.guild.members.fetch(reaction.message.author.id);
                if (membered.roles.cache.some(role => role.name === `allowed_secr2_${id}`)) { console.log('い'); return; }

                if (!embedSent) { // Only proceed if no embed has been sent yet
        console.log('あ');
                    const channels = reaction.message.guild.channels.cache;
                    const targetChannel = channels.find(channel => channel.name.startsWith('334sec-'));
                    const targetChannels = channels.find(channel => channel.name === "334sec");
                    const avatarURL = user.avatarURL();
                    const member = await reaction.message.guild.members.fetch(user.id);

                    const embed = new EmbedBuilder()
                        .addFields(
                            { name: 'ユーザー', value: `<@${user.id}>`, inline: true },
                            { name: 'リンク', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true },
                        )
                        .setColor('#FFE201')
                        .setThumbnail(avatarURL)
                        .setTimestamp();

                    const embedc = new EmbedBuilder()
                        .setTitle(`ユーザー${user.tag}がタイムアウトされました`)
                        .addFields(
                            { name: 'リンク', value: `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`, inline: true },
                            { name: '理由', value: `ブロックされたリアクション「${word}」の使用`, inline: true },
                        )
                        .setColor('#FFE201')
                        .setThumbnail(avatarURL)
                        .setTimestamp();

                    if (targetChannel) {
        console.log('あ');
                        let second;
                        let display;
                        const match_d = targetChannel.name.match(/-(\d+)day/);
                        const match_h = targetChannel.name.match(/-(\d+)hour/);
                        const match_m = targetChannel.name.match(/-(\d+)minute/);
                        const match_s = targetChannel.name.match(/-(\d+)second/);
                        if (match_d) {
                          second = Number(match_d[1] * 86400000);
                          display = match_d[1] + '日';
                        } else if (match_h) {
                          second = Number(match_h[1] * 3600000);
                          display = match_h[1] + '時間';
                        } else if (match_m) {
                          second = Number(match_m[1] * 60000);
                          display = match_m[1] + '分';
                        } else if (match_s) {
                          second = Number(match_s[1] * 1000);
                          display = match_s[1] + '秒';
                        }
                        
                        embed.setTitle('334sec 警告');
                        let timea;
                        try {
                            await member.timeout(second, '334sec');
                            embed.addFields({ name: 'タイムアウト', value: '成功', inline: true });
                            timea = true;
                        } catch (error) {
                            embed.addFields({ name: 'タイムアウト', value: '失敗', inline: true });
                            timea = false;
                        }
                        targetChannel.send({ embeds: [embed] });
                        if (timea === true) {
                            embedc.addFields({ name: 'タイムアウト', value: display, inline: true });
                            reaction.message.channel.send({ embeds: [embedc] });
                        }
                    } else if (targetChannels) {
                        embed.setTitle('334sec 警告');
                        embed.addFields({ name: 'タイムアウト', value: 'なし', inline: true });
                        targetChannel.send({ embeds: [embed] });
                    }

                    embedSent = true; // Set flag to true after sending the embed
                }

                break; // Exit the loop after sending the embed
            }
        }
    }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

'use strict';

//334close
//client.on('messageCreate', async message => {
//  if (message.channel.name === '334close') {
//    if (message.author.bot) return;
//    let data;
//    try {
//        data = JSON.parse(fs.readFileSync('users.json'));
//    } catch (err) {
//        data = {};
//    }
//  if (data[message.author.id]) return;
//  let data1;
//    try {
//      data1 = JSON.parse(fs.readFileSync('blocked.json'));
//    } catch(err) {
//      data1 = {};
//    }
//  if (data1[message.author.id]) return;
//    if (message.author.id === "1107938205031989272") return;
//    if (!message.attachments.size) await message.delete();
//    const author = { name: message.author.tag, iconURL: message.author.displayAvatarURL() };
//    const footer = { text: message.guild.name, iconURL: message.guild.iconURL() };
//    for (const channel of client.channels.cache.values()) {
//      if (channel.name !== '334close') continue;
//      if (message.content) {
//        const embed = new EmbedBuilder()
//          .setAuthor(author)
//          .setDescription(message.content)
//          .setColor('#FFE201')
//          .setFooter(footer)
//          .setTimestamp();
//        await channel.send({ embeds: [embed] });
//      }
//      for (const attachment of message.attachments.values()) {
//        const embed = new EmbedBuilder()
//          .setAuthor(author)
//          .setImage(attachment.url)
//          .setDescription(attachment.url)
//          .setColor('#FFE201')
//          .setFooter(footer)
//          .setTimestamp();
//        await channel.send({ embeds: [embed] });
//        }
//      }
//    }
//});

'use strict';

'use strict';

//const TWITTER_BEARER_TOKEN = process.env.bearerToken;
//const HASHTAG = '#カフェインはいいぞ委員会';
//const JSON_FILE = 'tweets.json';
//const axios = require('axios');

//async function fetchTweets() {
//    try {
//        const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=%23${HASHTAG}`, {
//            headers: {
//                'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
//            },
//            params: {
//                'query': `#${HASHTAG}`,
//           }
//        });

//        const tweets = response.data.data.map(tweet => ({
//            id: tweet.id,
//            url: `https://twitter.com/i/web/status/${tweet.id}`
//        }));
//
//        if (fs.existsSync(JSON_FILE)) {
///            const existingTweets = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
//            const newTweets = tweets.filter(tweet => !existingTweets.some(existingTweet => existingTweet.id === tweet.id));
//            if (newTweets.length > 0) {
//                fs.writeFileSync(JSON_FILE, JSON.stringify([...existingTweets, ...newTweets], null, 2));
//            }
//        } else {
//            fs.writeFileSync(JSON_FILE, JSON.stringify(tweets, null, 2));
//        }
//    } catch (error) {
//        console.error('Error fetching tweets:', error);
//    }
//}

//const { CronJob } = require('cron');

// client.on('messageUpdate', async (oldMessage, newMessage) => {
//     if (!oldMessage.content || !newMessage.content) {
//         try {
//             console.log(newMessage);
//             oldMessage = await newMessage.fetch();
//         } catch (error) {
//             console.error('メッセージの取得に失敗しました:', error);
//             return;
//         }
//     }
//   const data = JSON.parse(fs.readFileSync('log.json'));
//   if (!data[oldMessage.guild.id]) return;
//   data[oldMessage.guild.id].forEach(pair => {
//     if (pair.choice !== 'message') return;
//     const old = '```' + oldMessage.content + '```';
//     const newm = '```' + newMessage.content + '```';
//     const embed = new EmbedBuilder()
//       .setTitle('メッセージが編集されました')
//       .addFields({ name: '編集前', value: old },
//                  { name: '編集後', value: newm },
//                  { name: '当該メッセージ', value: `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`})
//       .setThumbnail(newMessage.author.displayAvatarURL())
//       .setTimestamp();
//     const Channel = newMessage.guild.channels.cache.find(channel => channel.name.includes('334log'));
//     if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
//     else Channel.send({ embeds: [embed] });
//   });
// });

client.on('voiceStateUpdate', (oldState, newState) => {
        const data = JSON.parse(fs.readFileSync('log.json'));
        if (!data[oldState.guild.id] && !data[newState.guild.id]) return;
        for (const pair of data[oldState.guild.id]) {
            if (pair.choice === 'voice') {
                const oldChannel = oldState.channel;
                const newChannel = newState.channel;
                const Channel = oldState.guild.channels.cache.find(channel => channel.name.includes('334log'));
                if (!oldChannel && newChannel) {
                  const username = client.users.cache.get(newState.member.id).name;
                  const embed = new EmbedBuilder()
                    .setTitle(`${newChannel.name} 参加ログ`)
                    .addFields(
                        { name: '参加者', value: `<@${newState.member.id}>`, inline: true },
                        { name: '参加チャンネル', value: `<#${newChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(newState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
                
                // ボイスチャットから退出したとき
                else if (oldChannel && !newChannel) {
                  const username = client.users.cache.get(newState.member.id).name;
                  const embed = new EmbedBuilder()
                    .setTitle(`${oldChannel.name} 退出ログ`)
                    .addFields(
                        { name: '退出者', value: `<@${oldState.member.id}>`, inline: true },
                        { name: '退出チャンネル', value: `<#${oldChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(oldState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
                
                // ボイスチャット内で移動したとき
                else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
                  const username = client.users.cache.get(newState.member.id).name;
                  const embed = new EmbedBuilder()
                    .setTitle(`${oldChannel.name} から ${newChannel.name} 移動ログ`)
                    .addFields(
                        { name: '移動者', value: `<@${newState.member.id}>`, inline: true },
                        { name: 'from', value: `<#${oldChannel.id}>`, inline: true },
                        { name: 'to', value: `<#${newChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(newState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
            } else if (pair.choice  === 'start') {
                const oldChannel = oldState.channel;
                const newChannel = newState.channel;
                if ((oldChannel && oldChannel.members.size !== 0) || (newChannel && newChannel.members.size !== 1)) return;
                const Channel = oldState.guild.channels.cache.find(channel => channel.name.includes('334log'));
                if (!Channel) return;
                if (!oldChannel && newChannel) {
                  const embed = new EmbedBuilder()
                    .setTitle(`${newChannel.name} 開始ログ`)
                    .addFields(
                        { name: '参加者', value: `<@${newState.member.id}>`, inline: true },
                        { name: '参加チャンネル', value: `<#${newChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(oldState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
                
                // ボイスチャットから退出したとき
                else if (oldChannel && !newChannel) {
                  if (oldChannel.members.size !== 0) return;
                  const username = client.users.cache.get(newState.member.id).name;
                  const embed = new EmbedBuilder()
                    .setTitle(`${oldChannel.name} 終了ログ`)
                    .addFields(
                        { name: '退出者', value: `<@${oldState.member.id}>`, inline: true },
                        { name: '退出チャンネル', value: `<#${oldChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(oldState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
                
                // ボイスチャット内で移動したとき
                else if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
                  const username = client.users.cache.get(newState.member.id).name;
                  const embed = new EmbedBuilder()
                    .setTitle(`${oldChannel.name} から ${newChannel.name} 移動ログ`)
                    .addFields(
                        { name: '移動者', value: `<@${newState.member.id}>`, inline: true },
                        { name: 'from', value: `<#${oldChannel.id}>`, inline: true },
                        { name: 'to', value: `<#${newChannel.id}>`, inline: true }
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(newState.member.user.displayAvatarURL());
                  if (pair.mentions) Channel.send({ content: `<@${pair.mentions}>`, embeds: [embed] });
                  else Channel.send({ embeds: [embed] });
                }
            }
        }
});

// const extractDetailsK = (text) => {
//   const regex = /^(?<datetime>\d{2}\/\d{2} \d{2}:\d{2}) (?<line>.+?【.+?】)(?<details>.+?) #TrainDelay$/;
//   const match = text.match(regex);
  
//   if (match && match.groups) {
//     const { datetime, line, details } = match.groups;
//     return { datetime, line, details: details.trim() };
//   } else {
//     return null;
//   }
// };
const extractDetailsD = (text) => {
  const regex = /^(?<line>.+?【.+?】)+\s(?<details>.+)$/;
  const match = text.match(regex);

  if (match && match.groups) {
    const { line, details } = match.groups;
    return { line, details: details.trim() };
  } else {
    return null;
  }
};

// const extractDetailsD = (text) => {
//   // 正規表現の調整
//   const regex = /^#(?<line>.+?) (?<status>.+?) \((?<datetime>\d{1,2}\/\d{1,2} \d{2}:\d{2}) .+?\)\n(?<details>.+?)(?: #TrainDelay.*)?$/s;
//   const match = text.match(regex);

//   if (match && match.groups) {
//     let { datetime, line, status, details } = match.groups;

//     // undefinedを空の文字列に変換
//     datetime = datetime || '';
//     line = line || '';
//     status = status || '';
//     details = details || '';

//     // いずれかが存在しないか空白の場合には空の文字列を返す
//     if (!datetime || !line || !status || !details) {
//       return '';
//     }

//     // 「号」を含む場合、その後の空白を基に分離
//     if (line.includes('号')) {
//       const lineParts = line.split(/号(?=\s)/);
//       line = lineParts.map(part => part.trim()).join('号');
//     }

//     return { datetime, line: `${line}【${status}】`, details: details.trim() };
//   } else {
//     return '';
//   }
// };

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


const datac = JSON.parse(fs.readFileSync('channels.json', 'utf8'));

client.on('ready', async () => {
  const ch_name = "334signal";
  const ch_kawa = "334kawa";

  client.channels.cache.forEach(channel => {
    // 対象チャンネルの設定を取得
    const dataca = datac.find(item => item[channel.id]) || {};

    // 334signalの処理
    if (channel.name === ch_name || (dataca[channel.id] && dataca[channel.id].includes("334signal"))) {
      cron.schedule('34 3 * * *', () => {
        if (saigai === 1) return;
        channel.send('3:34をお知らせします。');
        console.log('3:34 実行完了');
      });
      cron.schedule('34 13 * * *', () => {
        if (saigai === 1) return;
        channel.send('13:34をお知らせします。');
        console.log('13:34 実行完了');
      });
      cron.schedule('34 15 * * *', () => {
        if (saigai === 1) return;
        channel.send('午後3:34をお知らせします。');
        console.log('15:34 実行完了');
      });
      cron.schedule('34 23 * * *', () => {
        if (saigai === 1) return;
        channel.send('23:34をお知らせします。');
        console.log('23:34 実行完了');
      });

      cron.schedule('3 0 26 10 *', () => {
        if (saigai === 1) return;
        channel.send('今日は334記念日です。お祝いしましょう🎉🎉🎉');
        console.log('334記念 実行完了');
      });

      cron.schedule('34 3 3 4 *', () => {
        if (saigai === 1) return;
        channel.send('今日は334の日です。お祝いしましょう🎉🎉🎉');
        console.log('334の日 実行完了');
      });

//       cron.schedule('0 0 31 12 *', () => {
//         if (saigai === 1) return;
//         channel.send('今日は大晦日です！' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1190650829401767986/770732dc-0e03-416f-9262-add0d70425c8.mp4');
//         console.log('大晦日 実行完了');
//       });

//       cron.schedule('55 23 31 12 *', () => {
//         if (saigai === 1) return;
//         channel.send('この動画を12/31 23:59:16に再生すると、良き年越しができます' + '\n' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1190988536682397757/de3fce99-1bab-4bbd-9cac-6d66f082dd70.mp4');
//         console.log('年越し 実行完了');
//       });

      cron.schedule('0 0 10 8 *', () => {
        if (saigai === 1) return;
        channel.send('今日は野獣の日です。野獣邸への参拝は控え、今日はおうちで淫夢を楽しみましょう！');
        console.log('野獣記念 実行完了');
      });
    }

    // 334kawaの処理
    if (channel.name === ch_kawa || (dataca[channel.id] && dataca[channel.id].includes("334kawa"))) {
      const kawa = ['か', 'わ', 'む', 'ら', 'た', 'か', 'し'];

      const generateRandomKawa = () => {
        let autokawa = '';
        for (let i = 0; i < 7; i++) {
          autokawa += kawa[Math.floor(Math.random() * kawa.length)];
        }
        return autokawa;
      };

      const sendKawa = (channel, time) => {
        cron.schedule(time, () => {
          const autokawa = generateRandomKawa();
          channel.send(autokawa);
          console.log(time + ' 実行完了');
        });
      };

      if (saigai === 1) return;

      sendKawa(channel, '0 0 * * *'); // 0時に実行
      sendKawa(channel, '0 2 * * *'); // 2時に実行
      sendKawa(channel, '0 4 * * *'); // 4時に実行
      sendKawa(channel, '0 6 * * *'); // 6時に実行
      sendKawa(channel, '0 8 * * *'); // 8時に実行
      sendKawa(channel, '0 10 * * *'); // 10時に実行
      sendKawa(channel, '0 12 * * *'); // 12時に実行
      sendKawa(channel, '0 14 * * *'); // 14時に実行
      sendKawa(channel, '0 16 * * *'); // 16時に実行
      sendKawa(channel, '0 18 * * *'); // 18時に実行
      sendKawa(channel, '0 20 * * *'); // 20時に実行
      sendKawa(channel, '0 22 * * *'); // 22時に実行
    }
  });
  
   // try {
   //   setInterval(() => {
   //   // client.channels.cache.get("1054778318391627916").send(amn);
   //   //client.channels.cache.get("1054778318391627915").send(amn);
   //   //client.channels.cache.get("1055245249041141903").send(amn);
   //   //client.channels.cache.get("1157259536781017128").send(amn);
   //   //client.channels.cache.get("1155833436813131846").send(amn);
   //   }, 334000 * 1);
   //   setInterval(() => {
   //     client.channels.cache.get("1157259536781017128").send(tsn);
   //     // client.channels.cache.get("1155833436813131846").send(tsn);
   //     // client.channels.cache.get("1157260206573621278").send(tsn);
   //     // client.channels.cache.get("1157260211841679402").send(tsn);
   //     // client.channels.cache.get("1157260209069244468").send(tsn);
   //   }, 1145 * 1);
   // } catch(error) {
   //   return;
   // }
   try {
     const user = await client.users.fetch(axoid);
     setInterval(async () => {
       try {
         if (fs.readFileSync('axo.txt', 'utf8') === 'on') await user.send(axo);
       } catch(error) {
         let member;
         const guild = await client.guilds.fetch(process.env.sugarG);
         try {  
           member = await guild.members.fetch(axoid);
         } catch(error) {
           return;
         }
         const channel = await guild.channels.fetch('1265589925475127296');
         if (member && channel) {
           try {
             await channel.permissionOverwrites.create(member, {
               [PermissionFlagsBits.ViewChannel]: true
             });
            client.channels.cache.get('1265589925475127296').send(axo);
           } catch(error) {
             console.log(error);
             return;
           }
         } else {
           if (!member && !channel) fs.writeFileSync('axo.txt', 'off');
         }
       }
     }, 334 * 3);
   } catch(error) {
     console.log(error);
     if (client.guilds.fetch(process.env.sugarG).members.fetch(axoid)) {
       try {
         setInterval(() => {
           client.channels.cache.get('1265589925475127296').send(axo);
         }, 334 * 3);
       } catch(error) {
         console.log(error);
         return;
       }
     } else {
       fs.writeFileSync('axo.txt', 'off');
     }
   }

let isProcessing = false; // フラグを追加
let isProcessings = false;
let isProcessingn = false;

const checkRSSFeed = async () => {
  let quakeinfoe;
  if (isProcessing) return;
  isProcessing = true;

  let lastTitle = fs.readFileSync('lastTitle.txt', 'utf8');

  let feed;
  try {
    feed = await fetchRSS('https://unnerv.jp/@UN_NERV.rss');
  } catch (error) {
    console.error('RSSフィードの取得に失敗しました:', error);
    isProcessing = false;
    return;
  }

  let latestItem;
  if (feed) latestItem = feed.items[0];

  if (latestItem && latestItem.contentSnippet && latestItem.contentSnippet !== lastTitle) {
    if (latestItem.title && !latestItem.title.includes('気象')) {
      let embed;
      await client.channels.cache.forEach(async (channel) => {
        if (channel.name && channel.name.startsWith('quakeinfo')) {
          if (channel.name === 'quakeinfoe') return;
          const parts = channel.name.split('-');
          try {
            const description = latestItem.contentSnippet || '詳細なし';
            embed = new EmbedBuilder()
              .setTitle(latestItem.title)
              .addFields(
                { name: '内容', value: description },
                { name: 'URL', value: latestItem.link }
              )
              .setColor('#FFE201')
              .setTimestamp();

            if (latestItem.enclosure && latestItem.enclosure.url) {
              embed.setImage(latestItem.enclosure.url);
            }

            if (description.includes('地震情報') || description.includes('緊急地震速報') || description.includes('震源速報')) {
              if (description.includes('震度7') || description.includes('震度７')) {
                quakeinfoe = true;
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946997787234314/7.png');
              } else if (description.includes('震度6強') || description.includes('震度６強')) {
                quakeinfoe = true;
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946998005334127/6.png');
              } else if (description.includes('震度6弱') || description.includes('震度６弱')) {
                quakeinfoe = true;
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946998240219207/6-.png');
              } else if (description.includes('震度5強') || description.includes('震度５強')) {
                quakeinfoe = true;
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946998785609808/5.png');
              } else if (description.includes('震度5弱') || description.includes('震度５弱')) {
                quakeinfoe = true;
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946998508650548/5-.png');
              } else if (description.includes('震度4') || description.includes('震度４')) {
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946999041200238/4.png');
              } else if (description.includes('震度3') || description.includes('震度３')) {
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946999385260074/3.png');
              } else if (description.includes('震度2') || description.includes('震度２')) {
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946999607693394/2.png');
              } else if (description.includes('震度1') || description.includes('震度１')) {
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1220650107171508254/1272946999821598783/1.png');
              } else {
                embed.setThumbnail('https://media.unnerv.jp/accounts/avatars/000/000/001/original/d53dd7b3255a6f46.png');
              }
            } else {
              embed.setThumbnail('https://media.unnerv.jp/accounts/avatars/000/000/001/original/d53dd7b3255a6f46.png');
            }
          } catch (error) {
            console.error('Embedの作成に失敗しました:', error);
          }

          if (parts.length === 1) {
            await channel.send({ embeds: [embed] });
          } else if (channel.name === 'quakeinfoe') {
            if (quakeinfoe) await channel.send({ embeds: [embed] });
          } else {
            const lineName = parts[1];
            if (latestItem.contentSnippet.includes(lineName)) {
              await channel.send({ embeds: [embed] });
            }
          }
        }
      });

      let dataq = JSON.parse(fs.readFileSync('quakeinfo.json', 'utf8'));
      for (const id in dataq) {
        let preferences = dataq[id];

        try {
          const user = await client.users.fetch(id);
          if (Array.isArray(preferences) && preferences.some(pref => latestItem.contentSnippet.includes(pref))) {
            await user.send({ embeds: [embed] });
            console.log(`DM送信完了: ${id}`);
          }
        } catch (userError) {
          console.log(`ユーザーIDとして取得失敗: ${id} - ${userError.message}`);

          try {
            const channel = await client.channels.fetch(id);
            if ((preferences === 'null' || 
              (Array.isArray(preferences) && preferences.length === 1 && preferences[0] === 'null') || 
              (Array.isArray(preferences) && preferences.some(pref => latestItem.contentSnippet.includes(pref))))) {
              await channel.send({ embeds: [embed] });
              console.log(`チャンネル送信完了: ${id}`);
            
            // ここでボイスチャンネルかどうか確認して再生
            if (channel.type === 2) { 
                let sanitizedContent = latestItem.contentSnippet.replace(/\s+/g, '');
                const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=${sanitizedContent}&EXT=mp3`;
                console.log(audioUrl);
                const success = await playAudioInVoiceChannel(client, id, audioUrl);
                if (!success) continue; // 再生できなければ次のチャンネルへ
            }
            }
          } catch (channelError) {
            console.log(`チャンネルIDとして取得失敗: ${id} - ${channelError.message}`);
          }
        }
      }

      lastTitle = latestItem.contentSnippet;

      try {
        fs.writeFileSync('lastTitle.txt', lastTitle);
      } catch (error) {
        console.error('ファイルの書き込みに失敗しました:', error);
      }
      console.log('処理完了');
    }
  }

  isProcessing = false;
};

//     const checkRSSFeedE = async () => {

//       let lastTitlea = '';
//       // ファイルから最新のタイトルを読み込む
//       if (fs.existsSync('lastTitlea.txt')) {
//         lastTitlea = fs.readFileSync('lastTitlea.txt', 'utf8');
//       }
      
//       let feeda = await fetchRSS('https://unnerv.jp/@UN_NERV.rss');
//       if (!feeda) return;

//       let latestItema = feeda.items[0];

//       // 最新のアイテムが前回と異なる場合にのみメッセージを送信する
//       if (latestItema.contentSnippet !== lastTitlea) {
//         if ((latestItema.title && (latestItema.title.includes('震度5弱') || latestItema.title.includes('緊急地震速報') || latestItema.title.includes('津波に警戒') || latestItema.title.includes('津波警報'))) || (latestItema.description && (latestItema.description.includes('震度5弱') || latestItema.description.includes('緊急地震速報') || latestItema.description.includes('津波に警戒') || latestItema.description.includes('津波警報')))) {
//         client.channels.cache.forEach(channel => {
//           if (channel.name && channel.name.startsWith('quakeinfoe')) {
//             const parts = channel.name.split('-');
//                 // チャンネル名が "quakeinfoe" の場合はすべてのRSSを送信
//             let embeda;
//             try {
//               const descriptiona = latestItema.contentSnippet || '詳細なし';
//               embeda = new EmbedBuilder()
//                 .setTitle(latestItema.title)
//                 .addFields(
//                   { name: '内容', value: descriptiona },
//                   { name: 'URL', value: latestItema.link }
//                 )
//                 .setColor('#FFE201')
//                 .setThumbnail('https://media.unnerv.jp/accounts/avatars/000/000/001/original/d53dd7b3255a6f46.png');

//               if (latestItema.enclosure && latestItema.enclosure.url) {
//                 embeda.setImage(latestItema.enclosure.url);
//               }
//             } catch (error) {
//               console.error('Embedの作成に失敗しました:', error);
//             }

//                 if (parts.length === 1) {
//                   channel.send({ embeds: [embeda] });
//                 } else {
//                   // チャンネル名が "delainfo-絞り込み単語" の場合
//                   const regionName = parts[1];
//                   // 絞り込み単語が説明に含まれているか確認
//                   if (latestItema.title.includes(regionName)) {
//                   channel.send({ embeds: [embeda] });
//                 }
//           }
//           }
//           });
        
//           lastTitlea = latestItema.contentSnippet;

//           // 最新のタイトルをファイルに保存する
//           try {
//             fs.writeFileSync('lastTitlea.txt', lastTitlea);
//           } catch (error) {
//             console.error('ファイルの書き込みに失敗しました:', error);
//           }
//         }
//       }
//     }

const checkRSSFeedN = async () => {
    let lastTitlen = '';
    if (isProcessingn) return;
    isProcessingn = true;

    if (fs.existsSync('lastTitlen.txt')) {
        lastTitlen = fs.readFileSync('lastTitlen.txt', 'utf8');
    }
    let feed;
    try {
        feed = await fetchRSS('https://www.nhk.or.jp/rss/news/cat0.xml');
    } catch (error) {
      console.error('RSSフィードの取得に失敗しました:', error);
      isProcessingn = false;
      return;
    }

    let latestItem;
    if (feed) latestItem = feed.items[0];

    if (latestItem && latestItem.title && latestItem.title !== lastTitlen) {
        client.channels.cache.forEach(channel => {
            if (channel.name && channel.name.startsWith('334news')) {
                const parts = channel.name.split('-');
                // チャンネル名が "334news" の場合はすべてのRSSを送信
                if (parts.length === 1) {
                    channel.send(`${latestItem.title}\n${latestItem.link}`);
                } else {
                    // チャンネル名が "334news-単語" の場合
                    const newsName = parts[1];
                    // 単語がタイトルに含まれているか確認
                    if (latestItem.title.includes(newsName)) {
                        channel.send(`${latestItem.title}\n${latestItem.link}`);
                    }
                }
            }
        });

        let datan = JSON.parse(fs.readFileSync('334news.json', 'utf8'));
        for (const id in datan) {
            let userPreferences = datan[id];
            if (userPreferences.includes(['null']) || 
                (Array.isArray(userPreferences) && userPreferences.length === 1 && userPreferences[0] === 'null') || 
                (Array.isArray(userPreferences) && userPreferences.some(pref => latestItem.title.includes(pref)))) {
                console.log('334news 条件一致');
                try {
                    const user = await client.users.fetch(id);
                    await user.send(`${latestItem.title}\n${latestItem.link}`);
                    console.log('334news 送信完了');
                } catch (userError) {
                    console.log(`ユーザーIDとして取得失敗: ${id} - ${userError.message}`);
                    try {
                        const channel = await client.channels.fetch(id);

                        await channel.send(`${latestItem.title}\n${latestItem.link}`);
                        console.log('チャンネル送信完了: ' + id);
                        // ここでボイスチャンネルかどうか確認して再生
                        if (channel.type === 2) {
                          let sanitizedContent = latestItem.title.replace(/\s+/g, '、');
                          const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=${sanitizedContent}&EXT=mp3`;
                          console.log(audioUrl);
                          const success = await playAudioInVoiceChannel(client, id, audioUrl);
                          if (!success) continue; // 再生できなければ次のチャンネルへ
                        }
                    } catch (channelError) {
                        console.log(`チャンネルIDとして取得失敗: ${id} - ${channelError.message}`);
                    }
                }
            } else {
                console.log('334news 条件不一致');
            }
        }

        lastTitlen = latestItem.title;

        try {
            fs.writeFileSync('lastTitlen.txt', lastTitlen);
        } catch (error) {
            console.error('ファイルの書き込みに失敗しました:', error);
        }
      
    }
        isProcessingn = false;
};


// const checkRSSFeedD = async () => {
//     let lastTitled = '';

//     if (fs.existsSync('lastTitled.txt')) {
//         lastTitled = fs.readFileSync('lastTitled.txt', 'utf8');
//     }

//     let feedd;
//     try {
//         feedd = await fetchRSS('https://news.hostdon.ne.jp/@trainaccident.rss');
//     } catch (error) {
//         console.error('RSSフィードの取得に失敗しました:', error);
//         return;
//     }

//     let latestItemd;
//     if (feedd) latestItemd = feedd.items[0];
//     else if (!feedd) return;

//     const descriptiond = latestItemd.contentSnippet || '詳細なし';

//     if (latestItemd && descriptiond && descriptiond !== lastTitled && descriptiond.includes('www3.nhk.or.jp') && descriptiond.includes('#TrainDelay')) {
//         const haperror = `${descriptiond}\n${latestItemd.link}`;
//         const result = extractDetailsD(descriptiond);
//         if (!result) {
//             return;
//         }

//         let send;
//         if (result !== 'wrong') {
//             const datetime = result.datetime;
//             const line = result.line;
//             const details = result.details;
//             const detail = String(datetime + ' ' + details + `\n[トゥート](<${latestItemd.link}>)`);
//             try {
//                 send = new EmbedBuilder()
//                     .setTitle(line)
//                     .setDescription(detail)
//                     .setTimestamp()
//                     .setFooter({ text: '鉄道事故関連ニュース', iconURL: 'https://wsb.hostdon.ne.jp/sgm429/accounts/avatars/112/421/698/609/595/647/original/91642236c351821a.jpg' });
//             } catch (error) {
//                 console.log(error);
//                 send = haperror;
//             }
//         } else {
//             send = haperror;
//         }

//         client.channels.cache.forEach(channel => {
//             if (channel.name && channel.name.startsWith('delainfo')) {
//                 if (channel.name === 'delainfoc' || channel.name === 'delainfow') return;
//                 const parts = channel.name.split('-');
//                 if (parts.length === 1 || descriptiond.includes(parts[1])) {
//                     try {
//                         if (send !== haperror) channel.send({ embeds: [send] });
//                         else if (send === haperror) channel.send(haperror);
//                     } catch (error) {
//                         channel.send(haperror);
//                     }
//                 }
//             }
//         });

//         let datad = JSON.parse(fs.readFileSync('delainfo.json', 'utf8'));
//         for (const id in datad) {
//             let userPreferences = datad[id];
//             if (userPreferences === 'null' || 
//                 (Array.isArray(userPreferences) && userPreferences.length === 1 && userPreferences[0] === 'null') || 
//                 (Array.isArray(userPreferences) && userPreferences.some(pref => descriptiond.includes(pref)))) {
//                 console.log('delainfo 条件一致');

//                 try {
//                     const user = await client.users.fetch(id);
//                     try {
//                         if (send !== haperror) await user.send({ embeds: [send] });
//                         else if (send === haperror) await user.send(haperror);
//                     } catch (userError) {
//                         console.log(`ユーザーIDとして取得失敗: ${id} - ${userError.message}`);
//                     }
//                 } catch (userError) {
//                     try {
//                         const channel = await client.channels.fetch(id);
//                             await channel.send(send !== haperror ? { embeds: [send] } : haperror);
//                             console.log('チャンネル送信完了: ' + id);
                      
//                             // ここでボイスチャンネルかどうか確認して再生
//                             if (channel.type === 2) {
//                               let sanitizedContent = result.line.replace(/\s+/g, '');
//                               const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=${sanitizedContent}&EXT=mp3`;
//                               console.log(audioUrl);
//                               const success = await playAudioInVoiceChannel(client, id, audioUrl);
//                                 if (!success) continue; // 再生できなければ次のチャンネルへ
//                             }
//                     } catch (channelError) {
//                         console.log(`チャンネルIDとして取得失敗: ${id} - ${channelError.message}`);
//                     }
//                 }

//                 console.log('delainfo 送信完了');
//             } else {
//                 console.log('delainfo 条件不一致');
//             }
//         }

//         lastTitled = descriptiond;

//         try {
//             fs.writeFileSync('lastTitled.txt', lastTitled);
//         } catch (error) {
//             console.error('ファイルの書き込みに失敗しました:', error);
//         }
//     }
// };


// const checkRSSFeedK = async () => {
//     let lastTitlek = '';

//     // ファイルから最新のタイトルを読み込む
//     if (fs.existsSync('lastTitlek.txt')) {
//         lastTitlek = fs.readFileSync('lastTitlek.txt', 'utf8');
//     }

//     let feedk;
//     try {
//         feedk = await fetchRSS('https://mstdn.jp/@TrainKanto.rss');
//     } catch (error) {
//         console.error('RSSフィードの取得に失敗しました:', error);
//         return;
//     }

//     if (!feedk) return;

//     let latestItemk = feedk.items[0];
//     const descriptionk = latestItemk.contentSnippet || '詳細なし';

//     // 最新のアイテムが前回と異なる場合にのみメッセージを送信する
//     if (latestItemk && descriptionk && descriptionk !== lastTitlek) {
//         const haperror = `${descriptionk}\n${latestItemk.link}`;
//         const result = extractDetailsK(descriptionk);
//         const datetime = result.datetime;
//         const line = result.line;
//         const details = result.details;
//         const detail = String(datetime + ' ' + details + `\n[トゥート](<${latestItemk.link}>)`);
//         let send;
//         try {
//             send = new EmbedBuilder()
//                 .setTitle(line)  // タイトルは文字列のみ
//                 .setDescription(detail)
//                 .setTimestamp()
//                 .setFooter({ text: '関東の鉄道運行情報', iconURL: 'https://media.mstdn.jp/accounts/avatars/110/180/804/197/888/023/original/449bbfd5cb9552d7.png' });
//         } catch (error) {
//             console.log(error);
//             send = haperror;
//         }

//         client.channels.cache.forEach(channel => {
//             if (channel.name && channel.name.startsWith('delainfo')) {
//                 if (channel.name === 'delainfoc' || channel.name === 'delainfow') return;
//                 const parts = channel.name.split('-');
//                 // チャンネル名が "delainfo" の場合はすべてのRSSを送信
//                 if (parts.length === 1 || descriptionk.includes(parts[1])) {
//                     try {
//                         if (send !== haperror) channel.send({ embeds: [send] });
//                         else if (send === haperror) channel.send(haperror);
//                     } catch (error) {
//                         channel.send(haperror);
//                     }
//                 }
//             }
//         });

//         let datak = JSON.parse(fs.readFileSync('delainfo.json', 'utf8'));
//         for (const id in datak) {
//             let userPreferences = datak[id];
//             if (userPreferences === 'null' || 
//                 (Array.isArray(userPreferences) && userPreferences.length === 1 && userPreferences[0] === 'null') || 
//                 (Array.isArray(userPreferences) && userPreferences.some(pref => descriptionk.includes(pref)))) {
//                 console.log('delainfoK 条件一致');

//                 try {
//                     const user = await client.users.fetch(id);
//                     try {
//                         if (send !== haperror) await user.send({ embeds: [send] });
//                         else if (send === haperror) await user.send(haperror);
//                     } catch (userError) {
//                         console.log(`ユーザーIDとして取得失敗: ${id} - ${userError.message}`);
//                     }
//                 } catch (userError) {
//                     try {
//                         const channel = await client.channels.fetch(id);
//                             await channel.send(send !== haperror ? { embeds: [send] } : haperror);
//                             console.log('チャンネル送信完了: ' + id);
//                   // ここでボイスチャンネルかどうか確認して再生
//             if (channel.type === 2) {
//                 const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=${result.line}&EXT=mp3`;
//                 console.log(audioUrl);
//                 const success = await playAudioInVoiceChannel(client, id, audioUrl);
//                 if (!success) continue; // 再生できなければ次のチャンネルへ
//             }
//                     } catch (channelError) {
//                         console.log(`チャンネルIDとして取得失敗: ${id} - ${channelError.message}`);
//                     }
//                 }

//                 console.log('delainfoK 送信完了');
//             } else {
//                 console.log('delainfoK 条件不一致');
//             }
//         }

//         lastTitlek = descriptionk;

//         // 最新のタイトルをファイルに保存する
//         try {
//             fs.writeFileSync('lastTitlek.txt', lastTitlek);
//         } catch (error) {
//             console.error('ファイルの書き込みに失敗しました:', error);
//         }
//     }
// };

  
// let isProcessings = false;
let lastProcessedLink = '';

try {
    if (fs.existsSync('lastProcessedLink.txt')) {
        lastProcessedLink = fs.readFileSync('lastProcessedLink.txt', 'utf8');
        console.log("前回処理リンク:", lastProcessedLink);
    }
} catch (error) {
    console.error('前回のリンク情報の読み込みに失敗しました:', error);
}

const checkRSSFeedD = async () => {
    if (isProcessings) {
        console.log("前回の処理が完了していないためスキップします。");
        return;
    }

    isProcessings = true;
    // console.time('checkRSSFeedD');

    try {
        const feedd = await fetchRSS('https://bsky.app/profile/did:plc:xgoesh4b2eyay7mzzqykm2vd/rss');

        if (!feedd || !feedd.items || feedd.items.length === 0) {
            console.warn('RSSフィードが空か、アイテムが存在しません。');
            return; // リンクを取得できなかった場合はここでreturn
        }

        const latestItemd = feedd.items[0];

        if (!latestItemd || !latestItemd.link) {
            console.warn("最新の投稿にリンクが存在しません。");
            return; // リンクを取得できなかった場合はここでreturn
        }

        if (latestItemd.link === lastProcessedLink) {
            // console.log(`リンクが一致するため処理を終了します: ${lastProcessedLink} → ${latestItemd.link}`);
            return; // リンクが一致する場合はここでreturn
        }

        const descriptiond = latestItemd.contentSnippet || '詳細なし';
        const currentSeconds = Math.floor(Date.now() / 1000);
        console.log(`変更を検知しました: ${currentSeconds} - ${latestItemd.link}`);

        const haperror = `${descriptiond}\n${latestItemd.link}`;
        const result = extractDetailsD(descriptiond);

        let send;
        if (result && result !== 'wrong') {
            const line = result.line;
            const details = result.details;
            const detail = String(details + `\n[トゥート](<${latestItemd.link}>)`);
            try {
                send = new EmbedBuilder()
                    .setTitle(line)
                    .setDescription(detail)
                    .setTimestamp()
                    .setFooter({ text: 'delainfo', iconURL: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xgoesh4b2eyay7mzzqykm2vd/bafkreihugrrpozp4ameikn6kysitkcbdm3chspkmr5g5v35bekmwb5wxvu@jpeg' });
            } catch (error) {
                console.error("Embed作成エラー:", error);
                send = haperror;
            }
        } else {
            send = haperror;
        }

        client.channels.cache.forEach(channel => {
            if (channel.name && channel.name.startsWith('delainfo')) {
                if (channel.name === 'delainfoc' || channel.name === 'delainfow') return;
                const parts = channel.name.split('-');
                if (parts.length === 1 || descriptiond.includes(parts[1])) {
                    try {
                        if (send !== haperror) channel.send({ embeds: [send] });
                        else channel.send(haperror);
                    } catch (error) {
                        console.error(`チャンネル${channel.id}への送信エラー:`, error);
                        channel.send(haperror);
                    }
                }
            }
        });

        let datad;
        try {
            datad = JSON.parse(fs.readFileSync('delainfo.json', 'utf8'));
        } catch (error) {
            console.error('delainfo.jsonの読み込みエラー:', error);
            datad = {};
        }

        for (const id in datad) {
            let userPreferences = datad[id];
            if (userPreferences === 'null' ||
                (Array.isArray(userPreferences) && userPreferences.length === 1 && userPreferences[0] === 'null') ||
                (Array.isArray(userPreferences) && userPreferences.some(pref => descriptiond.includes(pref)))) {
                console.log('delainfo 条件一致');

                try {
                    const user = await client.users.fetch(id);
                    try {
                        if (send !== haperror) await user.send({ embeds: [send] });
                        else if (send === haperror) await user.send(haperror);
                    } catch (userError) {
                        console.log(`ユーザーIDとして取得失敗: ${id} - ${userError.message}`);
                    }
                } catch (userError) {
                    try {
                        const channel = await client.channels.fetch(id);
                        await channel.send(send !== haperror ? { embeds: [send] } : haperror);
                        console.log('チャンネル送信完了: ' + id);

                        if (channel.type === 2) {
                            let sanitizedContent = result.line.replace(/\s+/g, '');
                            const audioUrl = `https://cache-a.oddcast.com/tts/genB.php?EID=3&LID=12&VID=2&TXT=${sanitizedContent}&EXT=mp3`;
                            console.log(audioUrl);
                            // const success = await playAudioInVoiceChannel(client, id, audioUrl); // audio.jsが未定義の可能性があるのでコメントアウト
                            // if (!success) console.log(`ボイスチャンネル ${id} での再生に失敗`);
                        }
                    } catch (channelError) {
                        console.log(`チャンネルIDとして取得失敗: ${id} - ${channelError.message}`);
                    }
                }

                console.log('delainfo 送信完了');
            } else {
                console.log('delainfo 条件不一致');
            }
        }

        try {
            fs.writeFileSync('lastProcessedLink.txt', latestItemd.link);
            lastProcessedLink = latestItemd.link;
        } catch (error) {
            console.error('ファイルの書き込みに失敗しました:', error);
        }

    } catch (error) {
        console.error('checkRSSFeedD全体でエラーが発生:', error);
    } finally {
        isProcessings = false;
        // console.timeEnd('checkRSSFeedD');
    }
};
    //const checkRSSFeedM = async () => {
    //  let lastTitlem = '';
//
      // ファイルから最新のタイトルを読み込む
    //  if (fs.existsSync('lastTitlem.txt')) {
    //    lastTitlem = fs.readFileSync('lastTitlem.txt', 'utf8');
    //  }
    //  let feedm;
     // try {
     //       feedm = await parser.parseURL(process.env.feedm);
     //   } catch (error) {
     //       console.error('RSSフィードの取得に失敗しました:', error);
     //       return;
     //   }
    //let latestItemm = feedm.items[0];
    //const descriptionm = latestItemm.link;

    // 最新のアイテムが前回と異なる場合にのみメッセージを送信する
    //if (latestItemm && descriptionm && descriptionm !== lastTitlem) {
    //  client.channels.cache.forEach(channel => {
    //    if (channel.id && channel.id === process.env.feedmid) {
    //        channel.send(descriptionm);
    //    }
    //  });
//
    //  let datam = await JSON.parse(fs.readFileSync('maeda.json', 'utf8'));
    //  for (const userId in datam) {
    //    let userPreferences = datam[userId];
    //    if (userPreferences) {
    //      try {
    //        const user = await client.users.fetch(userId);
    //        await user.send(descriptionm);
    //        console.log('前田 送信完了');
    //        console.log(descriptionm);
    //      } catch (error) {
    //        console.log(`Failed to fetch user with ID ${userId}:`, error);
    //      }
     // }

    //  lastTitlem = descriptionm;
//
      // 最新のタイトルをファイルに保存する
    //  fs.writeFileSync('lastTitlem.txt', lastTitlem);
    //}
    //}

    setInterval(checkRSSFeed, 810);
    // setInterval(checkRSSFeedE, 1145);
    setInterval(checkRSSFeedN, 3643.64);
    setInterval(checkRSSFeedD, 5000);
    // setInterval(checkRSSFeedK, 11451);
    //setInterval(checkRSSFeedM, 1145141919);
});
// console.log(JSON.parse(fs.readFileSync('sec_reaction.json')));

  
    //const userId = '617289553455349771';
    //try {
      //const users = await client.users.fetch(userId);
      //setInterval(() => {
        //const send = 'https://i.imgur.com/y9x4SM4.mp4';
        //users.send('直ちにセクハラを中止しろ。' + send);
        //console.log('送信完了');
      //}, 334 * 1);
    //} catch (error) {
      //console.log(error)
    //}

//23:34
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('34 23 4 3 *', () => {
        //if (saigai === 1) return;
        //channel.send('334botをご利用の皆様 334botは、JR各社のダイヤ改正が予定されている3月16日に、「Spring Big(motor) Update 316」を行い、たくさんの機能を追加予定です。追加内容等は今後決定してまいりますので、お楽しみにお待ち下さい。詳細はアップデート一週間前の3/9にご案内します。')
        //console.log('23:34 SBU316 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//はつひので
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 6 1 1 *', () => {
        //if (saigai === 1) return;
        //channel.send('まもなく初日の出です！(添付ファイルは閲覧注意)' + '\n' + "【各主要都市の日の出時刻】" + '\n' + '札幌　7:06 仙台　6:53 東京　6:50 小笠原　6:20 金沢　7:05 名古屋　7:00 大阪　7:05 岡山　7:11 高松　7:10 福岡　7:22 那覇　7:17' + '\n' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1190994103316525136/5823aa3b-d354-4140-bb65-45371fd05436.mp4')
        //console.log('元日 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('10 20 20 31 12 *', () => {
        //if (saigai === 1) return;
        //channel.send('この電車は、回送列車です。ご乗車いただけません。間違えてご乗車されているお客さまは、進行方向前寄りの、<@1114542009802297474>までお越しください。')
        //console.log('回送 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転2
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('5 13 17 12 *', () => {
        //if (saigai === 1) return;
        //channel.send('この電車は、回送列車です。ご乗車いただけません。間違えてご乗車されているお客さまは、進行方向前寄りの、<@1114542009802297474>までお越しください。')
        //console.log('回送 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//復活
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 20 15 1 *', () => {
        //channel.send('只今より、334botは通常運転を再開致します！' + '\n' + '今回のbot復活にあたり、「quakeinfo」チャンネルを作成することで地震情報やJアラートなどを受信することができるようになります！他にも機能の追加がございますので、気になる方はサポートサーバーへ！' + '\n' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1196092125096464384/image.png')
        //console.log('復活 実行完了')
        //return;
      //})
      //return;
    //}
  //})
//});

//試運転3
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
   // if (channel.name === ch_name) {
      //cron.schedule('33 12 7 1 *', () => {
        //if (saigai === 1) return;
        //channel.send('この電車は、回送列車です。ご乗車いただけません。間違えてご乗車されているお客さまは、進行方向前寄りの、<@1114542009802297474>までお越しください。')
        //console.log('回送 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転3
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 0 7 2 *', () => {
        //if (saigai === 1) return;
        //channel.send('昨日ついに念願のおつbot導入に成功しました！！' + 'https://cdn.discordapp.com/attachments/1204430720999759892/1204438194020417626/16.mp4')
        //console.log('2/7 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転4
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 20 13 2 *', () => {
        //if (saigai === 1) return;
        //channel.send('大変お待たせいたしました！/pictureと/caffeineの実装に成功いたしました！！' + 'https://cdn.discordapp.com/attachments/1121386494364483634/1206910924510728223/caffeinepicture.gif')
        //console.log('2/13 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転5
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 0 10 3 *', () => {
        //if (saigai === 1) return;
        //channel.send('Spring Big(motor) Update 316まであと一週間を切りました！！！(||ポスター的なものの製作は間に合いませんでした…今度作ります||)')
        //console.log('3/9 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転6
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('34 17 15 3 *', () => {
        //if (saigai === 1) return;
        //channel.send('Spring Big(motor) Update 316まであと24時間を切りました！！！(本当は15:34にやりたかったですが…忘れました)')
        //console.log('3/15 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転7
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('0 0 16 3 *', () => {
        //if (saigai === 1) return;
        //channel.send('Spring Big(motor) Update 316まであと15時間34分！！！')
        //console.log('3/16 実行完了')
        //return;
      //})
      //return;
     //}
   //})
 //});

//試運転8
//client.on('ready', async () => {
  //const ch_name = "334signal";
  //client.channels.cache.forEach(channel => {
    //if (channel.name === ch_name) {
      //cron.schedule('34 15 16 3 *', () => {
        //if (saigai === 1) return;
        //channel.send('Spring Big(motor) Update 316 開始！！！')
        //console.log('3/16 実行完了')
        //return;
     // })
      //return;
     //}
   //})
 //});

// const fs = require("fs");
// const cacheFile = "traffic_cache.json";

// const cheerio = require("cheerio");
// const axios = require("axios");

// const url = "https://www3.nhk.or.jp/news/traffic/zenkoku/";

// async function scrapeTrafficInfo() {
//   try {
//     // サイトからHTMLを取得
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     // データを格納する配列
//     const trafficUpdates = [];

//     // HTMLを解析し、必要な情報を抽出
//     $("tr[data-v-5c859488]").each((_, element) => {
//       const routeName = $(element).find("td").eq(0).text().trim(); // 路線名
//       const status = $(element).find("td").eq(1).text().trim();   // 運行状況
//       const details = $(element).find("td").eq(2).text().trim();  // 詳細情報

//       // データを格納
//       if (routeName && status && details) {
//         trafficUpdates.push({
//           routeName,
//           status,
//           details,
//         });
//       }
//     });

//     // 抽出したデータを出力
//     console.log(trafficUpdates);

//     return trafficUpdates;
//   } catch (error) {
//     console.error("スクレイピング中にエラーが発生しました:", error.message);
//     return [];
//   }
// }

// async function detectTrafficChanges() {
//   const newData = await scrapeTrafficInfo();
//   if (!newData.length) return;

//   // キャッシュデータの読み込み
//   let oldData = [];
//   if (fs.existsSync(cacheFile)) {
//     oldData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
//   }

//   // 新しいデータの検出
//   const changes = newData.filter(
//     (newItem) =>
//       !oldData.some(
//         (oldItem) =>
//           oldItem.routeName === newItem.routeName &&
//           oldItem.status === newItem.status &&
//           oldItem.details === newItem.details
//       )
//   );

//   if (changes.length > 0) {
//     console.log("新しい情報が見つかりました:", changes);

//     // キャッシュを更新
//     fs.writeFileSync(cacheFile, JSON.stringify(newData, null, 2));
//   } else {
//     console.log("新しい情報はありません。");
//   }
// }

// // 定期実行
// setInterval(detectTrafficChanges, 5 * 60 * 1000); // 5分ごと
