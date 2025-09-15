const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  SelectMenuBuilder,
  StringSelectMenuBuilder, // エイリアスとして使っても良い
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ], 
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const { PermissionsBitField } = require('discord.js');

// --- Slash Command の実装 ---
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('チケットの生成')
        .addStringOption(op =>
            op.setName('title')
                .setDescription('チケットのタイトル')
                .setRequired(true)
        ),
    async execute(interaction) {
        const title = interaction.options.getString('title');
      
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          await interaction.reply({ content: '権限不足です', ephemeral: true });
          return;
        }
      
          const category = interaction.guild.channels.cache.find(
            (ch) => ch.type === ChannelType.GuildCategory && ch.name === title
          );

          if (category) {
            await interaction.reply({ content: 'タイトルが重複するチケットが存在します。タイトルを変えてやり直してください。', ephemeral: true });
            return;
          }

          if (title.includes("ようこそ")) {
            await interaction.reply({ content: '「ようこそ」をタイトルに含むチケットは作成できません。', ephemeral: true });
            return;
          }

          await interaction.guild.channels.create({
            name: title,
            type: ChannelType.GuildCategory,
          });

          // ボタン生成
          const button = new ButtonBuilder()
              .setCustomId('ticket_button')
              .setLabel(`生成`)
              .setStyle(ButtonStyle.Primary);

          const row = new ActionRowBuilder().addComponents(button);
          const embed = new EmbedBuilder()
                 .setTitle(title)
                 .setDescription(`チケットを生成するには「生成」ボタンを押してください。`)
                 .setColor('#FFE201');

          const message = await interaction.channel.send({
              embeds: [embed],
              components: [row],
              fetchReply: true
          });

          await interaction.reply({ content: 'ボタンを生成しました', ephemeral: true });
    }
};

// --- ボタン押下時の処理 ---
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
      if (interaction.component.label !== "生成" && interaction.component.label !== "クローズする") {
        return;
      }
        const embed = interaction.message.embeds[0];
        if (!embed) {
          return interaction.reply({ content: "カテゴリ情報が見つかりません。", ephemeral: true });
        }
        const categoryName = embed.title;
        let category = interaction.guild.channels.cache.find(
           (ch) => ch.type === ChannelType.GuildCategory && ch.name === categoryName
        );
      if (categoryName.includes("ようこそ")) {
          try {
            const channel = interaction.channel;
          
            const members = channel.members;
          
            const targets = members.filter(
              (member) => !member.permissions.has(PermissionFlagsBits.Administrator)
            );
          
            // 権限を編集（発言禁止にする例）
            for (const member of targets.values()) {
              await channel.permissionOverwrites.edit(member.id, {
                SendMessages: false,
              });
            }

            const oldName = channel.name;
            channel.setName(oldName.replace(/^secret-/, "closed-"));
            
            await interaction.reply({
              content: "チケットをクローズしました。",
            });
            
          } catch(error) {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.reply({ content: 'チケットの操作に失敗しました。チャンネル作成の権限がbotに付与されているかなどを、サーバーの管理者に確認してください。', components: [], ephemeral: true });
                }
          }
        } else {
            try {
                const user = interaction.member;
                const guild = interaction.guild;

                if (!category) {
                  category = await interaction.guild.channels.create({
                    name: categoryName,
                    type: ChannelType.GuildCategory,
                  });
                }
              
                const secretChannels = guild.channels.cache.filter(
                  (ch) => ch.parentId === category.id && /^secret-\d{4}$/.test(ch.name)
                );

                // 最大の番号を探す
                let maxNumber = 0;
                for (const ch of secretChannels.values()) {
                  const match = ch.name.match(/^secret-(\d{4})$/);
                  if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxNumber) maxNumber = num;
                  }
                }
                const nextNumber = String(maxNumber + 1).padStart(4, "0");
                const newChannelName = `secret-${nextNumber}`;
              
                // チャンネル作成
                const channel = await guild.channels.create({
                  name: newChannelName,
                  type: ChannelType.GuildText,
                  parent: category.id,
                  permissionOverwrites: [
                    {
                      id: guild.roles.everyone, // 全員を禁止
                      deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                      id: user.id, // コマンド実行者は許可
                      allow: [PermissionFlagsBits.ViewChannel],
                    },
                  ],
                });    
              await interaction.reply({
                content: `チャンネルを作成しました: ${channel}`,
                ephemeral: true,
              });

              const button2 = new ButtonBuilder()
                .setCustomId('close_button')
                .setLabel(`クローズする`)
                .setStyle(ButtonStyle.Primary);

              const row2 = new ActionRowBuilder().addComponents(button2);
              const embed2 = new EmbedBuilder()
                 .setTitle(`チケット${categoryName}へようこそ`)
                 .setDescription(`チケットをクローズするには、ボタンを押してください。`)
                 .setColor('#FFE201');

              const message = await channel.send({
                embeds: [embed2],
                components: [row2],
                fetchReply: true
              });
              
              } catch (error) {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.reply({ content: 'チケットの操作に失敗しました。チャンネル作成の権限がbotに付与されているかなどを、サーバーの管理者に確認してください。', components: [], ephemeral: true });
                }
              }
        }
    }
});

client.login(process.env.logintoken);
