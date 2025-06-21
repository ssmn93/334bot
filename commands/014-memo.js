const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, CommandInteraction, MessageAttachment } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('memo')
            .setDescription('メモの登録')
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
            op.setName('password')
                .setDescription('パスワードを入力してください(view実行時にメモを登録したアカウント)で入力することで内容が確認できます')
                .setRequired(true)
        )
      .addStringOption(op =>
            op.setName('content')
                .setDescription('内容を入力してください(view実行時には不要です)')
                .setRequired(false)
        ),
  
async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const content = interaction.options.getString('content');
        let password = interaction.options.getString('password');

        if (choice == 'post') {
    const username = interaction.user.username;
    const tag = interaction.user.discriminator;
    const fullUsername = `${username}#${tag}`;

    // コマンドが実行された時間を取得
    const timestamp = interaction.createdTimestamp;
    const date = new Date(timestamp); // Dateオブジェクトを作成
    const japanTime = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }); // 日本時間に変換

    let data = [];
    if (fs.existsSync(path.join(__dirname, 'memo.json'))) {
        data = JSON.parse(fs.readFileSync(path.join(__dirname, 'memo.json'), 'utf8'));
    }

    // タグを配列に変換
    password = password.split(',');

    // 新たなデータを作成
    const newEntry = { fullUsername, japanTime, content, password };

    // 新たなデータを追加
    data.push(newEntry);

    // データを保存
    fs.writeFileSync(path.join(__dirname, 'memo.json'), JSON.stringify(data));

    // データが正しく保存されたか確認
    const savedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'memo.json'), 'utf8'));
    if (Array.isArray(savedData) && savedData.some(item => item.fullUsername === fullUsername && item.japanTime === japanTime)) {
        // 保存完了
        interaction.reply(`登録が完了しました`);
    } else {
        // 保存失敗
        interaction.reply(`登録に失敗しました。再度お試しください。`);
    }
        } else if (choice == 'view') {
          if (fs.existsSync(path.join(__dirname, 'memo.json')) && fs.readFileSync(path.join(__dirname, 'memo.json'), 'utf8').length > 0) {
            // JSONファイルからデータを読み出す
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'memo.json'), 'utf8'));

            // memo.jsonの内容が正しい形式であることを確認
            if (Array.isArray(data) && data.every(item => item.hasOwnProperty('password'))) {
              // スラッシュコマンドを実行したユーザー名を取得
              const username = interaction.user.username;
              const tag = interaction.user.discriminator;
              const fullUsername = `${username}#${tag}`;

              let filteredData = data;

              // ユーザーIDとパスワードが一致するデータを抽出
              if (password) {
                password = password.split(',');
                filteredData = data.filter(item => item.fullUsername === fullUsername && item.password.some(pw => password.includes(pw)));
              }

              // データの中からランダムに一つを選択
              const randomIndex = Math.floor(Math.random() * filteredData.length);
              const selectedItem = filteredData[randomIndex];

              // 選択したデータを出力
              await interaction.reply(`User ID: ${selectedItem.fullUsername}\nTime: ${selectedItem.japanTime}\nContent: ${selectedItem.content}`);
            } else {
              // memo.jsonの内容が正しい形式でない場合
              interaction.reply('memo.jsonの形式が正しくありません。');
            }
          } else {
            // JSONファイルが存在しない、または空の場合
            // let data1;
            // try {
            //   data1 = JSON.parse(fs.readFileSync('blocked.json'));
            // } catch(err) {
            //   data1 = {};
            // }
            // if (data1[interaction.user.id]) return;
            interaction.reply('まだメモが登録されていません。');
          }
        }
    }
}