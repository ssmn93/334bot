const { SlashCommandBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});
const dataFilePath = 'sec.json';
const dataFilePathr = 'sec_reaction.json';

const loadData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
};
const loadDatar = () => {
    if (!fs.existsSync(dataFilePathr)) {
        fs.writeFileSync(dataFilePathr, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePathr));
};

const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};
const saveDatar = (datar) => {
    fs.writeFileSync(dataFilePathr, JSON.stringify(datar, null, 2));
};

function containsLetter(str) {
    return /[a-zA-Z]/.test(str);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sec')
        .setDescription('334secのNGワードを登録')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('機能選択')
                .setRequired(true)
                .addChoices(
                    { name: 'ban', value: 'ban' },
                    { name: 'ngword', value: 'ngword' },
                    { name: 'reaction', value: 'reaction' }
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
            option.setName('place')
                .setDescription('適用場所を選択')
                .setRequired(false)
                .addChoices(
                    { name: 'server', value: 'server' },
                    { name: 'channel', value: 'channel' }
                ))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('NGワードまたはユーザーID')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.channel.type === 'DM' || interaction.channel.type === 'GroupDM') return await interaction.reply('このコマンドはサーバーでのみ実行できます。');
        const choice = interaction.options.getString('choice');
        const mode = interaction.options.getString('mode');
        const guildId = interaction.guildId;
        const word = interaction.options.getString('content');   
        const place = interaction.options.getString('place')
        let data = loadData();
        let datar = loadDatar();
        let sec_id = fs.readFileSync('sec_id.txt');
        let sec_id_r = fs.readFileSync('sec_id_r.txt');

        //console.log(`Mode: ${mode}, GuildID: ${guildId}, Word: ${word}`);
        //console.log('Current data:', JSON.stringify(data, null, 2));
      if (choice === 'ngword') {
        if (mode === 'add') {
          if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます' , ephemeral: true });
            return;
          } else if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) {
            return interaction.reply({ content: 'このコマンドはサーバーでのみ使用できます', ephemeral: true });
            return;
          }
            if (!word) {
                await interaction.reply('wordを指定する必要があります。');
                return;
            }
            if (!data[guildId]) {
                data[guildId] = [];
            }
            let id;
            let places;
            if (place === 'channel') {
              id = interaction.channel.id;
              places = '実行チャンネル';
            } else if (place === 'server') {
              id = interaction.guild.id;
              places = '実行サーバー';
            } else return await interaction.reply('placeの選択が不適切です');
            let ids = String(Number(sec_id) + 1);
            data[guildId].push({ word, place: id, id: ids });
            saveData(data);
            console.log('Updated data after add:', JSON.stringify(data, null, 2));
            await interaction.reply(`「${word}」を${places}で登録しました。登録IDは「${ids}」です。`);
            fs.writeFileSync('sec_id.txt', ids);

        } else if (mode === 'delete') {
          if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます' , ephemeral: true });
            return;
          } else if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) {
            return interaction.reply({ content: 'このコマンドはサーバーでのみ使用できます', ephemeral: true });
            return;
          }
            if (!word) {
                await interaction.reply('wordを指定する必要があります。');
                return;
            }
            if (data[guildId]) {
              const pairIndex = data[guildId].findIndex(pair => pair.word === word);
              if (pairIndex !== -1) {
                data[guildId].splice(pairIndex, 1);
                saveData(data);
                await interaction.reply(`「${word}」を削除しました。`);
              } else {
                    await interaction.reply(`「${word}」が見つかりませんでした。`);
                    return;
                }
            } else {
                await interaction.reply('削除するNGワードが見つかりませんでした。');
            }

        } else if (mode === 'now') {
          if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) {
            return interaction.reply({ content: 'このコマンドはサーバーでのみ使用できます', ephemeral: true });
            return;
          } if (data[guildId] && data[guildId].length > 0) {
            let response = '現在のNGワード:\n';
            response += data[guildId].map(pair => {
              if (pair.place === interaction.guild.id) {
                return `${pair.word} (場所：サーバー) ID…${pair.id}`;
              } else {
                return `${pair.word} (場所：<#${pair.place}>) ID…${pair.id}`;
              }
            }).join('\n');
              await interaction.reply(response);
          } else {
            await interaction.reply('登録されたNGワードはありません。');
          }
        } else {
          await interaction.reply('無効なモードです。');
        }
      } else if (choice === 'reaction') {
            // リアクションの処理
            if (mode === 'add') {
                if (!word) return await interaction.reply('リアクションのキーワードを指定してください。');
                if (!datar[guildId]) datar[guildId] = [];

                let id = place === 'channel' ? interaction.channel.id : interaction.guild.id;
                let location = place === 'channel' ? 'チャンネル' : 'サーバー';
              
                const index = datar[guildId].findIndex(item => item.word === word);
                if (index !== -1 && index !== undefined) {
                  return await interaction.reply('キーワードが重複しています。');
                } else {
                  let indexs;
                  if (datar[interaction.channel.id]) {
                    indexs = datar[interaction.channel.id].findIndex(item => item.word === word);
                  } 
                  if (indexs !== -1 && indexs !== undefined) {
                    console.log(indexs);
                    return await interaction.reply('キーワードが重複しています。');
                  } else {
                    let ids = String(Number(sec_id_r) + 1);
                    datar[guildId].push({ word, place: id, id: ids });
                    saveDatar(datar);
                    return await interaction.reply(`リアクションキーワード「${word}」を${location}に登録しました。登録IDは「${ids}」です。`);
                    fs.writeFileSync('sec_id_r.txt', ids);
                  }
                }

            } else if (mode === 'delete') {
                if (!word) return await interaction.reply('削除するリアクションキーワードを指定してください。');
                if (!datar[guildId]) return await interaction.reply('リアクションキーワードが登録されていません。');

                const index = datar[guildId].findIndex(item => item.word === word);
                if (index !== -1) {
                    datar[guildId].splice(index, 1);
                    saveDatar(datar);
                    return await interaction.reply(`リアクションキーワード「${word}」を削除しました。`);
                } else {
                    return await interaction.reply(`リアクションキーワード「${word}」が見つかりませんでした。`);
                }
            } else if (mode === 'now') {
              if (datar[guildId] && datar[guildId].length > 0) {
                let response = '現在のNGリアクション:\n';
                response += datar[guildId].map(pair => {
                  if (pair.place === interaction.guild.id) {
                    return `${pair.word} (場所：サーバー) ID…${pair.id}`;
                  } else {
                    return `${pair.word} (場所：<#${pair.place}>) ID…${pair.id}`;
                  }
                }).join('\n');
                await interaction.reply(response);
              } else {
                return await interaction.reply('登録されているNGリアクションはありません。')
              }
            } else {
                return await interaction.reply('無効なモードです。');
            }
      } else if (choice === 'ban') {
        if (mode === 'add') {
           try {
             await interaction.guild.members.ban(word, { reason: '334secによるBAN' });
             await interaction.reply(`ユーザーID${word}のBANに成功しました。`)
           } catch(error) {
             return await interaction.reply('BANに失敗しました。十分な権限があるか、ユーザーIDが正しいか確認してください。')
           }
        } else if (mode === 'delete') {
          const banList = await interaction.guild.bans.fetch();
          const isBanned = banList.has(word);
          if (isBanned) {
            try {
              await interaction.guild.members.unban(word);
              await interaction.reply(`ユーザーID${word}のBAN解除に成功しました。`);
            } catch(error) {
              await interaction.reply('BAN解除に失敗しました');
            }
          } else return await interaction.reply('メンバーがBANされていません。');
        } else if (mode === 'now') {
          return await interaction.reply('現在nowオプションはご利用いただけません。');
        }
      }
    }
};
