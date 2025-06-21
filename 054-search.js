const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const ddg = require('duckduckgo-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('web検索を行います')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('検索ワードを入力')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');

        try {
            const results = await ddg.search(query, { count: 5 });
            const response = results.map(result => `[${result.title}](${result.url})`).join('\n');
            await interaction.reply(`Top 5 search results for "${query}":\n${response}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while searching. Please try again later.');
        }
    },
};