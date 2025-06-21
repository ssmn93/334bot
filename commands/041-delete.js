const { Client, SlashCommandBuilder, MessageActionRow, MessageSelectMenu, Discord, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.Message,
    Partials.Reaction
  ]
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('メッセージを削除')
    .addStringOption(op =>
            op.setName('choice')
                .setDescription('userで指定ユーザーIDの投稿を、messageでメッセージIDの投稿を削除')
                .addChoices(
                    { name: 'user', value: 'user' },
                    { name: 'message', value: 'message' }
                )
                .setRequired(true)
    )
    .addStringOption(op =>
            op.setName('id')
                .setDescription('メッセージIDまたはユーザーIDを入力して下さい')
                .setRequired(true)
    ),
	async execute(interaction) {
    const choice = interaction.options.getString('choice');
    if (choice == 'user') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await interaction.reply({ content: '権限不足です', ephemeral: true });
        return;
      } else {
        const fetched = await interaction.channel.messages.fetch({ limit: 100 });
        const userId = interaction.options.getString('id');
        try {
          const user = await client.users.fetch(userId);
        } catch (error) {
          return interaction.reply({ content:`ユーザーID ${userId} が有効ではありません。`, ephemeral: true });
        }
        const messages = fetched.filter(msg => msg.author.id === userId);
        try {
          interaction.channel.bulkDelete(messages);
        } catch(error) {
          await interaction.reply({ content:'BOTの権限が不足している可能性があります。サーバー管理者に連絡して下さい。', ephemeral: true });
          return;
        }
        await interaction.reply({ content:'削除が完了しました', ephemeral: true });
        return;
      }
    } else if (choice == 'message') {
      const messageId = interaction.options.getString('id');
      let message;
      try {
        message = await interaction.channel.messages.fetch(messageId);
      } catch(error) {
        await interaction.reply({ content: 'メッセージIDが無効である可能性があります。', ephemeral: true });
        return;
      }
      const userId = message.author.id;
      if (userId === "1127233136762298368") {
        try {
          message.delete();
        } catch(error) {
          await interaction.reply({ content: 'BOTの権限が不足している可能性があります。サーバー管理者に連絡してください。', ephemeral: true });
          return;
        }
        await interaction.reply({ content: '削除が完了しました', ephemeral: true });
        return;
      } else {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          await interaction.reply({ content: '権限不足です', ephemeral: true });
          return;
        } else {
          try {
            message.delete();
          } catch(error) {
            await interaction.reply({ content: 'BOTの権限が不足している可能性があります。サーバー管理者に連絡して下さい。', ephemeral: true });
            return;
          }
          await interaction.reply({ content: '削除が完了しました', ephemeral: true });
          return;
        }
      }
    }
	},
};

client.login(process.env.logintoken);