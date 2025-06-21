const { EmbedBuilder, SlashCommandBuilder, Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('メッセージを固定')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('オンオフ')
                .addChoices(
                    { name: 'on', value: 'on' },
                    { name: 'off', value: 'off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('content')
                .setDescription('固定する内容')
                .setRequired(false)),
    async execute(interaction) {
      const chid = interaction.channel.id;
      const content = interaction.options.getString('content');
      const choice = interaction.options.getString('choice');
      const name = interaction.user.tag;
      const icon = interaction.user.avatarURL();
      if (!interaction.guild) return await interaction.reply('lockコマンドはサーバーでのみ使用できます');
      if (choice === 'on') {
        if (!content) return await interaction.reply('登録する場合はcontentが必須です。');
        const data = JSON.parse(fs.readFileSync('lock.json', 'utf8'));
        const exists = data.some(item => item.chid === chid);
        if (exists) return await interaction.reply('同じチャンネルに２つ以上登録することはできません。deleteしてやりなおしてください。');
        const embed = new EmbedBuilder()
          .setAuthor({ name: name, iconURL: icon })
          .setDescription(content)
          .setColor('#FFE201')
          .setTimestamp();
        const message = await interaction.reply({ embeds: [embed] , fetchReply: true });
        const msid = message.id
        const newEntry = { chid, content, name, icon, msid };
        data.push(newEntry);
        fs.writeFileSync(path.join('lock.json'), JSON.stringify(data));
        console.log(data);
          
      } else {
        let data = JSON.parse(fs.readFileSync('lock.json', 'utf8'));
        data = data.filter(item => item.chid !== chid);
        fs.writeFileSync(path.join('lock.json'), JSON.stringify(data));
        await interaction.reply(`固定を削除しました`);
        console.log(data);
      }
    }
};