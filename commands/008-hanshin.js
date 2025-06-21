const { SlashCommandBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hanshin')
        .setDescription('オンオフする機能の選択')
        .addStringOption(op =>
            op.setName('choice')
                .setDescription('選択してください')
                .addChoices(
                    { name: 'user', value: 'user' },
                    { name: 'guild', value: 'guild' },
                    { name: 'channel', value: 'channel' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('onoff')
                .setDescription('オンオフ')
                .addChoices(
                    { name: 'lotte', value: 'on' },
                    { name: 'hanshin', value: 'off' },
                    { name: 'now', value: 'now' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('content')
                .setDescription('反応させたくない単語を入力')
                .setRequired(false)
        ),
    async execute(interaction) {
        let users = JSON.parse(fs.readFileSync('users.json'));
        let hikamani = JSON.parse(fs.readFileSync('hikamani.json')); 
        let inm = JSON.parse(fs.readFileSync('inmu.json')); 
        let guild = JSON.parse(fs.readFileSync('guild.json'));     
        let channel = JSON.parse(fs.readFileSync('channel.json'));
        let word = JSON.parse(fs.readFileSync('word.json'));

        const onoff = interaction.options.getString('onoff');
        const choice = interaction.options.getString('choice');
        const content = interaction.options.getString('content');
      
        await interaction.deferReply();

        if (onoff === 'on') {
            if (choice === 'user') {
                delete users[interaction.user.id];
                fs.writeFileSync('users.json', JSON.stringify(users));
                if (word[interaction.user.id]) {
                  delete word[interaction.user.id]; // チャンネルIDに対応するデータを削除
                  fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                }
            } else if (choice === 'hikamani') {
                delete hikamani[interaction.user.id];
                fs.writeFileSync('hikamani.json', JSON.stringify(hikamani));
            } else if (choice === 'inm') {
                delete inm[interaction.user.id];
                fs.writeFileSync('inmu.json', JSON.stringify(inm));
            } else if (choice === 'guild') {
                if (!interaction.guild) return await interaction.editReply('choiceがguildの場合、サーバーでの実行が必要となります。');
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== "1114542009802297474") return await interaction.editReply('管理権限が必要です');
                delete guild[interaction.guild.id];
                fs.writeFileSync('guild.json', JSON.stringify(guild));
                if (word[interaction.guild.id]) {
                  delete word[interaction.guild.id]; // チャンネルIDに対応するデータを削除
                  fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                }
            } else if (choice === 'channel') {
                if (!interaction.channel) return await interaction.editReply('choiceがchannelの場合、チャンネルでの実行が必要となります。');
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== "1114542009802297474") return await interaction.editReply('管理権限が必要です');
                delete channel[interaction.channel.id];
                fs.writeFileSync('channel.json', JSON.stringify(channel));
                if (word[interaction.channel.id]) {
                  delete word[interaction.channel.id]; // チャンネルIDに対応するデータを削除
                  fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                }
            }
            await interaction.editReply('リプライをオンにしました');
            
        } else if (onoff === 'off') {
            if (choice === 'user') {
              if (!content) {
                users[interaction.user.id] = true;
                fs.writeFileSync('users.json', JSON.stringify(users));
                await interaction.editReply('リプライをオフにしました');
              } else {
                const userId = interaction.user.id;

                // チャンネルIDに対応する配列がなければ作成
                if (!word[userId]) {
                  word[userId] = [];
                }

                // スラッシュコマンドで指定された文章を配列に追加
                word[userId].push(content);

                // JSONファイルに保存
                fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                await interaction.editReply(`${content}を含むメッセージへのリプライをオフにしました`);
              }  
              
            } else if (choice === 'hikamani') {
                hikamani[interaction.user.id] = true;
                fs.writeFileSync('hikamani.json', JSON.stringify(hikamani));
            } else if (choice === 'inm') {
                inm[interaction.user.id] = true;
                fs.writeFileSync('inmu.json', JSON.stringify(inm));
            } else if (choice === 'guild') {
              if (!content) {
                if (!interaction.guild) return await interaction.editReply('choiceがguildの場合、サーバーでの実行が必要となります。');
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== "1114542009802297474") return await interaction.editReply('管理権限が必要です');
                guild[interaction.guild.id] = true;
                fs.writeFileSync('guild.json', JSON.stringify(guild));
                await interaction.editReply('リプライをオフにしました');
              } else {
                const guildId = interaction.guild.Id;

                // チャンネルIDに対応する配列がなければ作成
                if (!word[guildId]) {
                  word[guildId] = [];
                }

                // スラッシュコマンドで指定された文章を配列に追加
                word[guildId].push(content);

                // JSONファイルに保存
                fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                await interaction.editReply(`${content}を含むメッセージへのリプライをオフにしました`);
              }
            } else if (choice === 'channel') {
              if (!content) {
                if (!interaction.channel) return await interaction.editReply('choiceがchannelの場合、チャンネルでの実行が必要となります。');
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== "1114542009802297474") return await interaction.editReply('管理権限が必要です');
                channel[interaction.channel.id] = true;
                fs.writeFileSync('channel.json', JSON.stringify(channel));
                await interaction.editReply('リプライをオフにしました');
              } else {
                const channelId = interaction.channel.id;

                // チャンネルIDに対応する配列がなければ作成
                if (!word[channelId]) {
                  word[channelId] = [];
                }

                // スラッシュコマンドで指定された文章を配列に追加
                word[channelId].push(content);

                // JSONファイルに保存
                fs.writeFileSync('word.json', JSON.stringify(word, null, 2));
                await interaction.editReply(`${content}を含むメッセージへのリプライをオフにしました`);
              }
            } 
            
        } else if (onoff === 'now') {
            if (choice === 'user') {
                if (users[interaction.user.id]) {
                    return await interaction.editReply('あなたのアカウントに対する反応は**オフ**です。');
                } else if (word[interaction.user.id] && word[interaction.user.id].length > 0) {
                  const words = word[interaction.user.id].join(', ');
                  await interaction.editReply(`現在登録されている単語: ${words}`);
                } else {
                    return await interaction.editReply('あなたのアカウントでの反応は**オン**です。');
                }

            } else if (choice === 'hikamani') {
                if (hikamani[interaction.user.id]) {
                    return await interaction.reply('ヒカマニ関係の反応は**オフ**です。');
                } else {
                    return await interaction.editReply('ヒカマニ関係の反応は**オン**です。');
                }
            } else if (choice === 'inm') {
                if (inm[interaction.user.id]) {
                    return await interaction.editReply('淫夢関係の反応は**オフ**です。');
                } else {
                    return await interaction.editReply('淫夢関係の反応は**オン**です。');
                }
            } 
              else if (choice === 'guild') {
                if (!interaction.guild) return await interaction.editReply('choiceがguildの場合、サーバーでの実行が必要となります。');
                if (guild[interaction.guild.id]) {
                  return await interaction.editReply('サーバー内での反応は**オフ**です。');
                } else if (word[interaction.guild.id] && word[interaction.guild.id].length > 0) {
                  const words = word[interaction.guild.id].join(', ');
                  await interaction.editReply(`現在登録されている単語: ${words}`);
                } else {
                  return await interaction.editReply('このサーバーでの反応は**オン**です。');
                }
            } else if (choice === 'channel') {
                if (!interaction.channel) return await interaction.editReply('choiceがchannelの場合、チャンネルでの実行が必要となります。');
                if (channel[interaction.channel.id]) {
                    return await interaction.editReply('このチャンネルでの反応は**オフ**です。');
                } else if (word[interaction.channel.id] && word[interaction.channel.id].length > 0) {
                  const words = word[interaction.channel.id].join(', ');
                  await interaction.editReply(`現在登録されている単語: ${words}`);
                } else {
                    return await interaction.editReply('このチャンネルでの反応は**オン**です。');
                }
            } else {
                return await interaction.editReply('条件に合致しませんでした');
            }
        }  
    },
};