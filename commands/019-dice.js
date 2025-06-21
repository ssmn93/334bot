const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const dice = ['1', '2', '3', '4', '5', '6'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('簡易的なサイコロ機能')
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('サイコロの最大値')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('letters')
                .setDescription('文字列指定')
                .setRequired(false)),
    async execute(interaction) {
        let max = interaction.options.getInteger('max') || 6;
        const letters = interaction.options.getString('letters') || '';

        // 1からmaxまでの数値のリストを作成
        const numbers = Array.from({ length: max }, (_, i) => (i + 1).toString());

        // ランダムに選択
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)];

        // lettersをカンマで区切って配列にする
        const letterArray = letters.split(',');

        // 対応する文字を取得
        const letter = letterArray[randomNum - 1] || '';

        // 結果を組み合わせる
        const result = `${randomNum} ${letter}`;
        
        await interaction.reply(result);
    },
};