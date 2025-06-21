const { SlashCommandBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');
const dataFilePath = 'log.json';

const loadData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
};

const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

function containsLetter(str) {
    return /[a-zA-Z]/.test(str);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('334logの設定')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('機能選択')
                .setRequired(true)
                .addChoices(
                    { name: 'voice 参加退出', value: 'voice' },
                    { name: 'voice 開始終了', value: 'start' },
                    { name: 'サーバー参加退出', value: 'join' },
                    // { name: 'メッセージ更新', value: 'message' }
                    // { name: 'メッセージ変更', value: 'delete' }
                ))
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('操作モード (add, delete, now)')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'delete', value: 'delete' },
                    { name: 'now', value: 'now' }
                ))
        .addStringOption(option =>
            option.setName('mention')
                .setDescription('メンション')
                .setRequired(false)
                .addChoices(
                    { name: 'true', value: 'true' },
                    { name: 'false', value: 'false' }
                )),
    async execute(interaction) {
        if (interaction.channel.type === 'DM' || interaction.channel.type === 'GroupDM') return await interaction.reply('このコマンドはサーバーでのみ実行できます。');
        const choice = interaction.options.getString('choice');
        const mode = interaction.options.getString('mode');
        const guildId = interaction.guildId;
        let mention = interaction.options.getString('mention');
        if (!mention) mention = 'false';
        let data = loadData();

        //console.log(`Mode: ${mode}, GuildID: ${guildId}, Word: ${word}`);
        //console.log('Current data:', JSON.stringify(data, null, 2));
        if (mode === 'add') {
          if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます' , ephemeral: true });
            return;
          } else if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) {
            return interaction.reply({ content: 'このコマンドはサーバーでのみ使用できます', ephemeral: true });
            return;
          } if(!interaction.guild.channels.cache.find(channel => channel.name.includes('334log'))) {
            return await interaction.reply({ content: '先に「334log」を含むチャンネルを作成してください', ephemeral: true });
            return;
          }
            if (!data[guildId]) {
                data[guildId] = [];
            } else {
              for (const pair of data[guildId]) {
                if (((choice === 'voice' || choice === 'start') && (pair.choice === 'voice' || pair.choice === 'start')) || pair.choice === choice) { 
                  return await interaction.reply({ content: '同じ通知がすでに登録されています。deleteにて削除してください。', ephemeral: true });
                }
              }
            }
            let mentions;
            if (mention === 'true') {
              mentions = interaction.user.id
            } else if (mention === 'false') {
              mentions = false;
            }
            data[guildId].push({ choice, mentions });
            saveData(data);
            console.log('Updated data after add:', JSON.stringify(data, null, 2));
            let name;
            if (choice === 'voice') name = 'ボイスチャンネル 参加退出';
            if (choice === 'start') name = 'ボイスチャンネル 開始終了';
            if (choice === 'join') name = 'サーバー参加退出';
            if (choice === 'message') name = 'メッセージ更新';
            await interaction.reply(`${name}の通知をメンション${mention}で登録しました。`);

        } else if (mode === 'delete') {
          if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます' , ephemeral: true });
            return;
          } else if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) {
            return interaction.reply({ content: 'このコマンドはサーバーでのみ使用できます', ephemeral: true });
            return;
          }
            if (data[guildId]) {
              const pairIndex = data[guildId].findIndex(pair => pair.choice === choice);
              if (pairIndex !== -1) {
                data[guildId].splice(pairIndex, 1);
                saveData(data);
                await interaction.reply(`${choice}通知を削除しました。`);
              } else {
                    await interaction.reply(`${choice}通知の登録が見つかりませんでした。`);
                    return;
                }
            } else {
                await interaction.reply('削除する登録が見つかりませんでした。');
            }

        } else if (mode === 'now') {
          if (!data[guildId]) {
            return interaction.reply('ログ通知が登録されていません');
          }

          let matched = data[guildId].some(pair => pair.choice === choice); // choiceに一致するものがあるかどうか確認

          let name;
          if (choice === 'voice') name = 'ボイスチャンネル 参加退出';
          if (choice === 'start') name = 'ボイスチャンネル 開始終了';
          if (choice === 'join') name = 'サーバー参加退出';
          if (choice === 'message') name = 'メッセージ更新';

          if (matched) {
            await interaction.reply(`${name}の通知は登録されています。`);
          } else {
            await interaction.reply(`${name}の通知は登録されていません。`);
          }
          // return await interaction.reply('ただいまオプションnowはご利用いただけません。');
        } else {
          await interaction.reply('無効なモードです。');
        }
    }
};
