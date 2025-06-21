const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('チャンネル系機能(334signal等)の設定')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('機能指定')
                .setRequired(true)
                .addChoices(
                    { name: '334signal', value: '334signal' },
                    { name: '334kawa', value: '334kawa' }
                ))
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('オンオフを指定')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'on' },
                    { name: 'off', value: 'off' }
                )),
    async execute(interaction) {
        const channelId = interaction.channel.id; // コマンドを実行したチャンネルID
        const inputString = interaction.options.getString('mode'); // オプションで指定された文字列
        const choice = interaction.options.getString('choice'); // オプションで指定されたオンオフ

        // JSONファイルを読み込む
        let jsonData;
        try {
            jsonData = JSON.parse(fs.readFileSync('channels.json', 'utf8'));
        } catch (err) {
            jsonData = []; // ファイルが存在しない場合は新しい配列を作成
        }

        // チャンネルIDが既に存在するか確認
        let channelData = jsonData.find(item => Object.keys(item)[0] === channelId);

        if (choice === 'on') {
            // オンの場合: チャンネルIDが存在し、文字列がまだ登録されていない場合は追加
            if (channelData) {
                if (!channelData[channelId].includes(inputString)) {
                    channelData[channelId].push(inputString);
                }
            } else {
                // チャンネルIDが存在しない場合は新しく追加
                const newChannelData = {};
                newChannelData[channelId] = [inputString];
                jsonData.push(newChannelData);
            }
            await interaction.reply(`${inputString} 機能を登録しました`);
        } else if (choice === 'off') {
            // オフの場合: チャンネルIDが存在し、配列に文字列が含まれている場合は削除
            if (channelData && channelData[channelId].includes(inputString)) {
                channelData[channelId] = channelData[channelId].filter(item => item !== inputString);

                // 配列が空になった場合、そのチャンネルのデータも削除
                if (channelData[channelId].length === 0) {
                    jsonData = jsonData.filter(item => Object.keys(item)[0] !== channelId);
                }
                await interaction.reply(`${inputString} 機能を削除しました`);
            } else {
                await interaction.reply(`${inputString} 機能は登録されていません`);
            }
        }

        // JSONファイルに保存
        fs.writeFileSync('channels.json', JSON.stringify(jsonData, null, 2));
    }
};
