const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('AFKを登録します')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('返信する文章の内容')
                .setRequired(true)),
    async execute(interaction) {
        const data = JSON.parse(fs.readFileSync('afk.json', 'utf-8') || '{}');
        const content = interaction.options.getString('content');
        data[interaction.user.id] = content;
        fs.writeFileSync('afk.json', JSON.stringify(data, null, 2));
        await interaction.reply(`反応単語「${content}」でAFKを登録しました。`);
        console.log(JSON.parse(fs.readFileSync('afk.json', 'utf-8') || '{}'));
    }
};