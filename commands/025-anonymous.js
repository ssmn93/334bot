const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
// ユーザーのIDとタイムスタンプを保存するオブジェクト
let userTimestamps = JSON.parse(fs.readFileSync('anonymous_u.json'));;
// ユーザーのIDとコマンド実行回数を保存するオブジェクト
let userCounts = JSON.parse(fs.readFileSync('anonymous_c.json'));;

// スラッシュコマンドの定義
module.exports = {
  data: new SlashCommandBuilder()
    .setName('anonymous')
    .setDescription('匿名でメッセージを送信します')
    .addStringOption(option =>
        option.setName('action')
            .setDescription('アクションを選択してください')
            .setRequired(true)
            .addChoices(
              { name: 'post', value: 'post' },
              { name: 'view', value: 'view' }
              )
      )
    .addStringOption(option =>
        option.setName('content')
            .setDescription('送信するメッセージの内容、またはメッセージIDを入力してください')
            .setRequired(true)
      ),

// スラッシュコマンドの処理
async execute(interaction) {

    const { commandName } = interaction;

    if (commandName === 'anonymous') {
        const action = interaction.options.getString('action');
        const content = interaction.options.getString('content');

        if (action === 'post') {
          const userId = interaction.user.id;

        // ユーザーが最後にコマンドを実行した時間を取得
        const lastExecution = userTimestamps[userId];
        // ユーザーが最後にコマンドを実行した回数を取得
        const count = userCounts[userId] || 0;

        // 現在の時間を取得
        const now = Date.now();

        // ユーザーが最後にコマンドを実行してから1時間が経過していない場合、または1時間で6回以上実行した場合、エラーメッセージを返す
        if ((lastExecution && (now - lastExecution < 3600000) && count >= 30)) {
            return await interaction.reply('1時間に6回以上の実行はできません。');
        }

        // ユーザーの最後の実行時間と回数を更新
        userTimestamps[userId] = now;
        userCounts[userId] = (now - lastExecution < 3600000) ? count + 1 : 1;
        fs.writeFileSync('anonymous_u.json', JSON.stringify(userTimestamps, null, 2));
        fs.writeFileSync('anonymous_c.json', JSON.stringify(userCounts, null, 2));
    if (!interaction.isCommand()) return;
            // メッセージを同じチャンネルで送信
            const message = await interaction.channel.send({
              content: content,
              allowedMentions: { parse: [] },
            });

            // メッセージの詳細をJSONファイルに保存
            const data = {
                id: message.id,
                userId: interaction.user.id,
                timestamp: interaction.createdTimestamp,
                content: content
            };

            // 既存のデータを読み込む
            let jsonData = {};
            if (fs.existsSync(path.join(__dirname, 'anonymous.json'))) {
                jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'anonymous.json'), 'utf-8'));
            }

            // 新しいデータを追加
            jsonData[message.id] = data;

            // データを再度保存
            fs.writeFileSync(path.join(__dirname, 'anonymous.json'), JSON.stringify(jsonData));
          
            //投稿完了
            await interaction.reply({ content: 'Your post was successful!', ephemeral: true });
        } else if (action === 'view') {
            // メッセージの詳細をJSONファイルから読み込み
            const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'anonymous.json'), 'utf-8'));
            const data = jsonData[content];

            // メッセージの詳細をユーザーに送信（ただし、メッセージを投稿したユーザーのみ）
            try {
              await interaction.reply({
              content: `User ID: <@${data.userId}>\nTimestamp: ${new Date(data.timestamp).toLocaleString()}\nMessage Content: ${data.content}`,
              //`User ID: ${data.userId}\nTimestamp: ${new Date(data.timestamp).toLocaleString()}`);
              ephemeral: true
                });
            } catch(error) {
              await interaction.reply({content: '取得に失敗しました。有効なメッセージIDか確認してください', ephemeral: true})
              return;
            }
            } else {
                await interaction.reply('You do not have permission to view this message.');
            }
        }
    }
};