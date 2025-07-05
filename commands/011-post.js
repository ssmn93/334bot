const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const restrictedTags = ['#melody', '#train', '#ad']; // 特定のタグリスト

// タグのチェックを行う関数
function hasRestrictedTags(tagsArray, restrictedTags) {
    return tagsArray.some(tag => restrictedTags.includes(tag));
}

let userTimestamps = {};
let userCounts = {};
const adminId = process.env.admin;
const Discord = require("discord.js");
const {
    Client,
    GatewayIntentBits: {
        Guilds,
        GuildMessages,
        MessageContent
    },
    Collection,
    Events,
    GatewayIntentBits,
    Partials,
    Permissions
} = require("discord.js");

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction
    ]
});
client.login(process.env.logintoken)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('写真や文章の投稿')
        .addStringOption(op =>
            op.setName('choice')
                .setDescription('選択してください postが投稿、viewが閲覧')
                .addChoices(
                    { name: 'post', value: 'post' },
                    { name: 'view', value: 'view' }
                )
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('imageurl')
                .setDescription('画像のURLを入力してください(view実行時には不要です)')
                .setRequired(false)
        )
        .addStringOption(op =>
            op.setName('content')
                .setDescription('投稿の文章を入力してください(view実行時には不要です)')
                .setRequired(false)
        )
        .addStringOption(op =>
            op.setName('tags')
                .setDescription('タグをカンマ区切りで入力してください')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply(); // 応答を保留

            const choice = interaction.options.getString('choice');
            let imageUrl = interaction.options.getString('imageurl');
            let content = interaction.options.getString('content');
            let tags = interaction.options.getString('tags');

            if (imageUrl === null) {
                imageUrl = "https://cdn.discordapp.com/attachments/1220650107171508254/1230481938339467314/null_334post.png?ex=66337a9b&is=6621059b&hm=56b7b4096b6ff86d9e47b6f327dd128d814549cc80e18f7c022557856772ba2f&";
            }

            if (content === null) {
                content = "null";
            }

            if (tags === null) {
                tags = "#null";
            }

            if (choice === 'post') {
                const userId = interaction.user.id;
                const lastExecution = userTimestamps[userId];
                const count = userCounts[userId] || 0;
                const now = Date.now();

                if ((lastExecution && (now - lastExecution < 3600000) && count >= 6)) {
                    return await interaction.editReply('1時間に6回以上の実行はできません。');
                }

                userTimestamps[userId] = now;
                userCounts[userId] = (now - lastExecution < 3600000) ? count + 1 : 1;
                // let data1;
                // try {
                //     data1 = JSON.parse(fs.readFileSync('blocked.json'));
                // } catch (err) {
                //     data1 = {};
                // }
                // if (data1[interaction.user.id]) return;

                const username = interaction.user.username;
                const tag = interaction.user.discriminator;
                const fullUsername = `${username}#${tag}`;
                const iconUrl = interaction.user.avatarURL();

                const timestamp = interaction.createdTimestamp;
                const date = new Date(timestamp);
                const japanTime = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

                let data = [];
                if (fs.existsSync(path.join(__dirname, 'picture.json'))) {
                    data = JSON.parse(fs.readFileSync(path.join(__dirname, 'picture.json'), 'utf8'));
                }

                const tagsArray = tags.split(',').map(tag => tag.trim()); // カンマ区切りで分割し、余分な空白を削除
            
                // 特定のタグが含まれている場合の処理
                if (hasRestrictedTags(tagsArray, restrictedTags) && interaction.user.id !== "1114542009802297474") {
                  await interaction.editReply('タグに #melody, #train, または #ad が含まれています。');
                  return; // 処理を終了
                }
              
                tags = tags.split(',');

                const newEntry = { fullUsername, japanTime, imageUrl, content, tags, iconUrl };

                data.push(newEntry);

                fs.writeFileSync(path.join(__dirname, 'picture.json'), JSON.stringify(data));

                let replyMessage = '登録が完了しました';
              
                const prof = `<@${interaction.user.id}>`
              
                const embed = new EmbedBuilder()
                    .setTitle('投稿')
                    .addFields(
                        { name: 'User ID', value: fullUsername + "\n" + prof, inline: true },
                        { name: 'Time', value: japanTime, inline: true },
                        { name: 'Tags', value: tags.join(', '), inline: true },
                        { name: 'URL', value: `[here](<${imageUrl}>)`, inline: true },
                        { name: 'Content', value: content, inline: false },
                    )
                    .setColor('#FFE201')
                    .setTimestamp()
                    .setThumbnail(iconUrl)
                    .setImage(imageUrl);

                await interaction.editReply(replyMessage);
                await interaction.channel.send({ embeds: [embed] });
              
                const user = await client.users.fetch(adminId);
                await user.send({ embeds: [embed] });
                
                if (imageUrl.includes('jpeg') || imageUrl.includes('JPEG') || imageUrl.includes('jpg') || imageUrl.includes('JPG') || imageUrl.includes('gif') || imageUrl.includes('GIF') || imageUrl.includes('png') || imageUrl.includes('PNG') || imageUrl.includes('webp') || imageUrl.includes('WEBP')) {
                  return;
                } else {
                  try {
                    interaction.channel.send(imageUrl);
                    user.send(imageUrl);
                  } catch(error) {
                    console.error(error);
                  }
                }

            } else if (choice === 'view') {
                // let data1;
                // try {
                //     data1 = JSON.parse(fs.readFileSync('blocked.json'));
                // } catch (err) {
                //     data1 = {};
                // }
                // if (data1[interaction.user.id]) return;

                const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'picture.json'), 'utf8'));

                let filteredData = data;

                if (tags && tags !== "#null") {
                    try {
                        tags = tags.split(',');
                        filteredData = data.filter(item => item.tags.some(tag => tags.includes(tag)));
                    } catch (error) {
                        await interaction.editReply('エラーが発生しました。タグに合致する投稿がない可能性があります');
                        return;
                    }
                }

                const randomIndex = Math.floor(Math.random() * filteredData.length);
                const selectedItem = filteredData[randomIndex];
              
                // const match = selectedItem.imageUrl.match(/avatars\/(\d+)\//);
              
                let embed;
                try {
                let prof;
                try {
                  const url = new URL("https://cdn.discordapp.com/avatars/1114542009802297474/b71279f616f35cf4b938d5fd7c512d08.webp");
                  const pathParts = url.pathname.split('/');
                  const id = pathParts[2];
                  prof = `${selectedItem.fullUsername}\n(<@${id}>)`;
                } catch(error) {
                  console.log(error);
                  prof = selectedItem.fullUsername
                }
                    embed = new EmbedBuilder()
                        .setTitle('投稿')
                        .addFields(
                            { name: 'User ID', value: prof, inline: true },
                            { name: 'Time', value: selectedItem.japanTime, inline: true },
                            { name: 'Tags', value: selectedItem.tags.join(', '), inline: true },
                            { name: 'URL', value: `[here](<${selectedItem.imageUrl}>)`, inline: true },
                            { name: 'Content', value: selectedItem.content, inline: false }
                        )
                        .setColor('#FFE201')
                        .setTimestamp()
                        .setThumbnail(selectedItem.iconUrl)
                        .setImage(selectedItem.imageUrl);
                } catch (error) {
                    await interaction.editReply('投稿の取得に問題が発生しました');
                    return;
                }

                await interaction.editReply({ embeds: [embed] });
                if (selectedItem.imageUrl.includes('jpeg') || selectedItem.imageUrl.includes('JPEG') || selectedItem.imageUrl.includes('jpg') || selectedItem.imageUrl.includes('JPG') || selectedItem.imageUrl.includes('gif') || selectedItem.imageUrl.includes('GIF') || selectedItem.imageUrl.includes('png') || selectedItem.imageUrl.includes('PNG') || selectedItem.imageUrl.includes('webp') || selectedItem.imageUrl.includes('WEBP')) {
                  return;
                } else {
                  try {
                    interaction.channel.send(selectedItem.imageUrl);
                  } catch(error) {
                    console.error(error);
                  }
                }
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply('エラーが発生しました。再試行してください。');
            } else if (!interaction.deferred) {
                await interaction.followUp('エラーが発生しました。再試行してください。');
            }
        }
    },
};
