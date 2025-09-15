const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  SelectMenuBuilder,
  StringSelectMenuBuilder, // エイリアスとして使っても良い
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle 
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ], 
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const { PermissionsBitField } = require('discord.js');

// roles.json の設定
const rolesFilePath = path.join(__dirname, 'roles.json');
if (!fs.existsSync(rolesFilePath)) {
    fs.writeFileSync(rolesFilePath, JSON.stringify([]));
}
const dataFilePath = 'password.json';

const loadData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
};
// console.log(loadData());

const passwordFilePath = loadData();
const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// キャプチャ用の一時保存用マップ（ユーザーIDをキーにして正解文字列と対象ロールIDを保存）
const captchaMap = new Map();

// キャプチャ文字列生成（例：6文字の英数字）
function generateCaptchaText(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}

// Canvas を使ってキャプチャ画像を生成（バッファを返す）
async function generateCaptchaImage(text) {
    const width = 200;
    const height = 100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // ノイズ（オプション）
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(0,0,0,0.1)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }
    
    // キャプチャ文字列を描画
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#000000';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    ctx.fillText(text, (width - textWidth) / 2, (height + 40) / 2);
    
    return canvas.toBuffer();
}

// --- Slash Command の実装 ---
module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('ロールを付与できるメッセージを送信')
        .addStringOption(op =>
            op.setName('verify')
                .setDescription('画像認証の使用')
                .addChoices(
                    { name: 'true', value: 'true' },
                    { name: 'false', value: 'false' }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('roleid')
                .setDescription('ロールを入力してください')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('roleid2')
                .setDescription('2つめのロールを入力してください')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('roleid3')
                .setDescription('3つめのロールを入力してください')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('roleid4')
                .setDescription('4つめのロールを入力してください')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('roleid5')
                .setDescription('5つめのロールを入力してください')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('ロールボタンのタイトルを入力してください')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('password')
                .setDescription('パスワード認証のパスワードを入力してください。')
                .setRequired(false)
        ),
    async execute(interaction) {
      
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          await interaction.reply({ content: '権限不足です', ephemeral: true });
          return;
        }

        let verify = interaction.options.getString('verify');
        let title = interaction.options.getString('title');
        if (!title) title = 'ロールを取得';
        let roleId = interaction.options.getString('roleid');
        let roleId2 = interaction.options.getString('roleid2');
        let roleId3 = interaction.options.getString('roleid3');
        let roleId4 = interaction.options.getString('roleid4');
        let roleId5 = interaction.options.getString('roleid5');
        let password = interaction.options.getString('password');

        // ロールIDが <@&123456789012345678> の形式の場合、ID 部分だけを抽出
        const idExtractor = (str) => {
            if (str.startsWith('<@&')) {
                const regex = /<@&(\d+)>/;
                const match = str.match(regex);
                return match ? match[1] : null;
            }
            return str;
        };
        roleId = idExtractor(roleId);
        if (!roleId) {
            await interaction.reply({ content: 'ロールを確認できませんでした。再試行してください。', ephemeral: true });
            return;
        }
        if (roleId2) {
            roleId2 = idExtractor(roleId2) || false;
        } else {
            roleId2 = false;
        }
        if (roleId3) {
            roleId3 = idExtractor(roleId3) || false;
        } else {
            roleId3 = false;
        }
        if (roleId4) {
            roleId4 = idExtractor(roleId4) || false;
        } else {
            roleId4 = false;
        }
        if (roleId5) {
            roleId5 = idExtractor(roleId5) || false;
        } else {
            roleId5 = false;
        }
      
        if (password && (roleId2 || roleId3 || roleId4 || roleId5)) {
          return await interaction.reply('パスワード認証は、一つのロールのみに対応しています。');
        }
        
        const role = interaction.guild.roles.cache.get(roleId);
        let role2, role3, role4, role5;
        if (roleId2) role2 = interaction.guild.roles.cache.get(roleId2);
        if (roleId3) role3 = interaction.guild.roles.cache.get(roleId3);
        if (roleId4) role4 = interaction.guild.roles.cache.get(roleId4);
        if (roleId5) role5 = interaction.guild.roles.cache.get(roleId5);

        if (!role) {
            await interaction.reply({ content: 'ロールを確認できませんでした。再試行してください。', ephemeral: true });
            return;
        }

        let data = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
      
        if (!password) {

          // ボタン生成
          const button = new ButtonBuilder()
              .setCustomId('role_button')
              .setLabel(`1️⃣`)
              .setStyle(ButtonStyle.Primary);
          const button2 = new ButtonBuilder()
              .setCustomId('role_button2')
              .setLabel('2️⃣')
              .setStyle(ButtonStyle.Primary);
          const button3 = new ButtonBuilder()
              .setCustomId('role_button3')
              .setLabel('3️⃣')
              .setStyle(ButtonStyle.Primary);
          const button4 = new ButtonBuilder()
              .setCustomId('role_button4')
              .setLabel('4️⃣')
              .setStyle(ButtonStyle.Primary);
          const button5 = new ButtonBuilder()
              .setCustomId('role_button5')
              .setLabel('5️⃣')
              .setStyle(ButtonStyle.Primary);

          let row;
          let embed;
          if (role && role2 && role3 && role4 && role5) {
              row = new ActionRowBuilder().addComponents(button, button2, button3, button4, button5);
              embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`1️⃣:<@&${roleId}>\n2️⃣:<@&${roleId2}>\n3️⃣:<@&${roleId3}>\n4️⃣:<@&${roleId4}>\n5️⃣:<@&${roleId5}>`)
                 .setColor('#FFE201');
          } else if (role && role2 && role3 && role4 && !role5) {
              row = new ActionRowBuilder().addComponents(button, button2, button3, button4);
              embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`1️⃣:<@&${roleId}>\n2️⃣:<@&${roleId2}>\n3️⃣:<@&${roleId3}>\n4️⃣:<@&${roleId4}>`)
                 .setColor('#FFE201');
          } else if (role && role2 && role3 && !role4 && !role5) {
              row = new ActionRowBuilder().addComponents(button, button2, button3);
              embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`1️⃣:<@&${roleId}>\n2️⃣:<@&${roleId2}>\n3️⃣:<@&${roleId3}>`)
                 .setColor('#FFE201');
          } else if (role && role2 && !role3 && !role4 && !role5) {
              row = new ActionRowBuilder().addComponents(button, button2);
              embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`1️⃣:<@&${roleId}>\n2️⃣:<@&${roleId2}>`)
                 .setColor('#FFE201');
          } else if (role && !role2 && !role3 && !role4 && !role5) {
              row = new ActionRowBuilder().addComponents(button);
              embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`取得できるロール:<@&${roleId}>`)
                 .setColor('#FFE201');
          } else {
              await interaction.reply({ content: 'ボタンの生成に失敗しました。roleid、roleid2の順番に入力できているか確認してください。', ephemeral: true });
              return;
          }

          const message = await interaction.channel.send({
              embeds: [embed],
              components: [row],
              fetchReply: true
          });

          await interaction.reply({ content: 'ボタンを生成しました', ephemeral: true });

          const newEntry = { verify, messageId: message.id, roleId, roleId2, roleId3, roleId4, roleId5 };
          data.push(newEntry);
          fs.writeFileSync(rolesFilePath, JSON.stringify(data, null, 2), 'utf8');
        } else if (password) {
  // チャンネルIDに対応するエントリー配列を取得（存在しない場合は空配列とする）
  let entries = passwordFilePath[interaction.channel.id] || [];

  // 既に同じ roleId と password のエントリーが存在するか確認する
  const index = entries.findIndex(entry => entry.roleId === roleId);

  if (index > -1) {
    // 既存エントリーが見つかった場合は、そのエントリーを削除
    entries.splice(index, 1);

    // エントリーがなくなったらキー自体を削除（任意）
      await interaction.reply({ content: `${password} を削除しました`, ephemeral: true });
    console.log(passwordFilePath);
    // } else {
    //   const newEntry = { roleId, password };
    //   // passwordFilePath[interaction.channel.id] = entries;
    //   passwordFilePath[interaction.channel.id].push(newEntry);
    // }
    // saveData(passwordFilePath);
    // console.log(passwordFilePath);
    // await interaction.reply({ content: `${password} を登録しました`, ephemeral: true });
  } else {
    // 同じエントリーがなければ、新規登録
    // キーが存在しなければまず空の配列を作成
    if (!passwordFilePath[interaction.channel.id]) {
      passwordFilePath[interaction.channel.id] = [];
    }
    const newEntry = { roleId, password };
    passwordFilePath[interaction.channel.id].push(newEntry);
    saveData(passwordFilePath);
    console.log(passwordFilePath);
    await interaction.reply({ content: `${password} で登録しました`, ephemeral: true });
  }
}

    }
};

// --- ボタン押下時の処理 ---
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
      if (interaction.component.label === "生成" || interaction.component.label === "クローズする") return;
        const roles = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
        const roleEntry = roles.find(entry => entry.messageId === interaction.message.id);
        if (!roleEntry) {
            await interaction.reply({ content: 'このメッセージに対応するロールが見つかりません。', ephemeral: true });
            return;
        }
        
        // ボタンのラベルに応じて対象ロールIDを決定
        const label = interaction.component.label;
        let targetRoleId;
        if (label === '2️⃣') targetRoleId = roleEntry.roleId2;
        else if (label === '3️⃣') targetRoleId = roleEntry.roleId3;
        else if (label === '4️⃣') targetRoleId = roleEntry.roleId4;
        else if (label === '5️⃣') targetRoleId = roleEntry.roleId5;
        else targetRoleId = roleEntry.roleId;
        
        // verify が "true" なら画像認証を実施（Select Menu で選択させる）
        if (roleEntry.verify === "true") {
            // ① 正解キャプチャ文字列の生成
            const captchaText = generateCaptchaText();
            // ② 画像生成
            const captchaImageBuffer = await generateCaptchaImage(captchaText);
            // ③ キャプチャ情報を保存
            captchaMap.set(interaction.user.id, { captchaText, roleId: targetRoleId, createdAt: Date.now() });
            
            // ④ distractor（誤答）の生成（正解と同じ桁数の文字列をいくつか作成する）
            const totalOptions = 4; // 選択肢数（正解を含む）
            const optionsSet = new Set();
            optionsSet.add(captchaText);
            while (optionsSet.size < totalOptions) {
                let option = generateCaptchaText();
                if (option === captchaText) continue;
                optionsSet.add(option);
            }
            const optionsArray = Array.from(optionsSet);
            // ランダムに並び替え
            for (let i = optionsArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
            }
            // Select Menu の選択肢を作成
            const selectOptions = optionsArray.map(option => {
                return {
                    label: option,
                    value: option
                };
            });
            
            const selectMenu = new SelectMenuBuilder()
                .setCustomId('captchaSelect')
                .setPlaceholder('正しい文字列を選択してください')
                .addOptions(selectOptions);
            const actionRow = new ActionRowBuilder().addComponents(selectMenu);
            
            // ⑤ エフェメラルな応答でキャプチャ画像と Select Menu を送信
            await interaction.reply({ 
                content: '画像認証を行います。以下の画像に表示されている文字列を確認し、正しいものを選択してください。',
                files: [{ attachment: captchaImageBuffer, name: 'captcha.png' }],
                components: [actionRow],
                ephemeral: true
            });
            return;
        }
        
        // verify が "false" の場合は従来通りロールの付与/解除を実施
        const role = interaction.guild.roles.cache.get(targetRoleId);
        if (!role) {
            await interaction.reply({ content: 'このロールは存在しません。', ephemeral: true });
            return;
        }
        try {
            const member = interaction.member;
            if (!member.roles.cache.has(targetRoleId)) {
                await member.roles.add(role);
                await interaction.reply({ content: `ロール「${role.name}」が付与されました。`, ephemeral: true });
            } else {
                await member.roles.remove(role);
                await interaction.reply({ content: `ロール「${role.name}」が削除されました。`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'ロールの操作に失敗しました。サーバー設定の「ロール」から、付与するロールがbotのつけられたロールより下にあるか確認してください。' + '\n' + 'https://cdn.discordapp.com/attachments/1190287335569489940/1347233733081825310/image.png?ex=67cb14b0&is=67c9c330&hm=2518117f3d2586a71d1739239285ce4326dd4d148f90e5642a9bb67d4042c981&', components: [], ephemeral: true });
            }
        }
    }
});

// --- Select Menu (captcha) の処理 ---
client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'captchaSelect') {
        const stored = captchaMap.get(interaction.user.id);
        if (!stored) {
            await interaction.reply({ content: '認証情報が見つかりません。再度ボタンを押してください。', ephemeral: true });
            return;
        }
        const selectedValue = interaction.values[0]; // ユーザーの選択
        if (selectedValue === stored.captchaText) {
            // 正解の場合、対象ロールの付与/解除を実施
            const role = interaction.guild.roles.cache.get(stored.roleId);
            if (!role) {
                await interaction.reply({ content: 'このロールは存在しません。', ephemeral: true });
                return;
            }
            try {
                const member = interaction.member;
                if (!member.roles.cache.has(stored.roleId)) {
                    await member.roles.add(role);
                    await interaction.update({ content: `認証成功！ロール「${role.name}」が付与されました。`, components: [] });
                } else {
                    await member.roles.remove(role);
                    await interaction.update({ content: `認証成功！ロール「${role.name}」が削除されました。`, components: [] });
                }
            } catch (error) {
                console.error(error);
                await interaction.update({ content: 'ロールの操作に失敗しました。サーバー設定の「ロール」から、付与するロールがbotのつけられたロールより下にあるか確認してください。' + '\n' + 'https://cdn.discordapp.com/attachments/1190287335569489940/1347233733081825310/image.png?ex=67cb14b0&is=67c9c330&hm=2518117f3d2586a71d1739239285ce4326dd4d148f90e5642a9bb67d4042c981&', components: [] });
            }
        } else {
            await interaction.update({ content: '認証に失敗しました。選択した文字列が正しくありません。', components: [] });
        }
        captchaMap.delete(interaction.user.id);
    }
});

client.login(process.env.logintoken);
