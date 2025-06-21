const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription('数式を計算します')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('計算する数式 掛け算は*、割り算は/で3+3+4、3*3*4の形で')
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        let result;
        try {
            result = eval(expression);
        } catch (error) {
            return await interaction.reply('数式の形式が正しくありません。');
        }
        await interaction.reply(`計算結果は ${result} です。`);
    },
};