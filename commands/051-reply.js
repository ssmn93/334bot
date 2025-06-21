const { SlashCommandBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});
const dataFilePath = 'reply.json';
const up = '1stup.json';

const loadData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
};
const loadDataup = () => {
    if (!fs.existsSync(up)) {
        fs.writeFileSync(up, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(up));
};

const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};
const saveDataup = (datas) => {
    fs.writeFileSync(up, JSON.stringify(datas, null, 2));
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reply')
        .setDescription('単語への反応を登録')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('操作モード (add, delete, now)')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'delete', value: 'delete' },
                    { name: 'now', value: 'now' },
                    { name: 'old', value: 'old' }
                ))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('反応単語')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('返信単語')
                .setRequired(false)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const id = interaction.guild ? interaction.guild.id : interaction.user.id;
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');      
        let data = loadData();
        let datas = loadDataup();

        // 必要に応じてデータを初期化
        if (!data[id]) {
            data[id] = [];
        }

        if (mode === 'add') {
            if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== process.env.admin) {
                return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます', ephemeral: true });
            }
            if (!from || !to) {
                await interaction.reply('「from」と「to」の両方を指定する必要があります。');
                return;
            }
            data[id].push({ from, to });
            saveData(data);
            await interaction.reply(`「${from}」→「${to}」で登録しました。`);

        } else if (mode === 'delete') {
            if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== process.env.admin) {
                return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます', ephemeral: true });
            }
            if (!from || !to) {
                await interaction.reply('「from」と「to」の両方を指定する必要があります。');
                return;
            }
            if (data[id]) {
                const pairIndex = data[id].findIndex(pair => pair.from === from && pair.to === to);
                if (pairIndex !== -1) {
                    data[id].splice(pairIndex, 1);
                    saveData(data);
                    await interaction.reply(`「${from}」→「${to}」を削除しました。`);
                } else {
                    await interaction.reply(`「${from}」→「${to}」が見つかりませんでした。`);
                    return;
                }
            } else {
                await interaction.reply('削除する単語ペアが見つかりませんでした。');
            }

        } else if (mode === 'now') {
            if (data[id] && data[id].length > 0) {
                let response = '現在の単語ペア:\n';
                response += data[id].map(pair => `from: ${pair.from} - to: ${pair.to}`).join('\n');
                await interaction.reply(response);
            } else {
                await interaction.reply('登録された単語ペアはありません。');
            }
        } else if (mode === 'old') {
            if (interaction.guild && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== process.env.admin) {
                return interaction.reply({ content: '管理権限があるユーザーのみこのコマンドを使用できます', ephemeral: true });
            }
            if (datas[id]) {
              datas[id] = false;
              saveDataup(datas);
              await interaction.reply(`旧単語反応機能を削除しました。`);
              console.log(datas);
              
            } else {
              datas[id] = true;
              saveDataup(datas);
              await interaction.reply(`旧単語反応機能を登録しました。`);
              console.log(datas);
            }

        } else {
            await interaction.reply('無効なモードです。');
        }
    }
};