const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
// ユーザーのIDとタイムスタンプを保存するオブジェクト
let userTimestamps = {};
// ユーザーのIDとコマンド実行回数を保存するオブジェクト
let userCounts = {};
const ad = [
`
https://discord.gg/tnmabVWcAG
# 人が大量に減っています！！！！

📷 **__鉄道写真を共有したい方大募集！！__**
🎉 鉄道に興味無い人でも**大歓迎！！**
📢 __宣伝目的も大歓迎！__
🛡️ VortexやWickで**荒らし対策バッチリ！**
🔞 **R18専用チャンネルもあります！**
🤝 鯖連携__大歓迎！！__様々な特典が貰えます！！
🔥 **__毎日カオスに楽しくやってます！！__**
🎊 5月末までに**__300人__**目指してます！！
# 少しでも気になったら是非参加しましょう！！！
`,
`
ちょっと宣伝すんよ〜
⬜⬜⬜🏿🏿🏿🏻🏻🏻🏻
⬜⬜🏿🏿🏾🏾🏿🏻🏻🏻
⬜⬜🏿🏼🏽🏽🏼🏻🏻🏻
⬜⬜🏾🏽🏽🏽🏽🏻🏻🏻
⬜⬜🏾🏼🏽🏽🏼🏻🏻🏻
⬜⬜️⬜🏾🏼🏼🏼🏻🏻🏻
⬜⬜⬜🏽🏾🏾🏻🏻🏻🏻
⬜⬜⬜🏼🏼🏽🏻🏻🏻🏻
⬜🏿🏿🏿🏿🏼🏿🏿🏻🏻
🏿🏿🏿🏿🏿🏿🏿🏿🏿🏿
┌――∧―――――――――-┐
| 今こそ、淫夢を輝かせる時だ｡|
| 淫夢について語り合う！　 　 |
| 淫夢について考察し合う！　  |
|  野獣先輩を捜索する！               |
| そんなdiscordサーバー、           | 
| 「810.net」に                                  |
| 参加してくれよ〜頼むよ〜       |
└――――――――――――-┘

👤 淫夢厨大歓迎！
✅ 認証機能で安全！
🤖 楽しいBOTも追加中！
📢 ボイスチャットも充実！
🗞️ 宣伝可！
🔞 18禁チャンネルもあります！

ぜひ参加ください！🈁↑↓
https://discord.gg/fhYxa4rn4v
`
]

//動作確認
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ad')
		.setDescription('サーバー宣伝'),
	async execute(interaction) {
        const userId = interaction.user.id;
        // スラッシュコマンドを実行したユーザー名を取得
        // ユーザーが最後にコマンドを実行した時間を取得
        const lastExecution = userTimestamps[userId];
        // ユーザーが最後にコマンドを実行した回数を取得
        const count = userCounts[userId] || 0;

        // 現在の時間を取得
        const now = Date.now();

        // ユーザーが最後にコマンドを実行してから1時間が経過していない場合、または1時間で6回以上実行した場合、エラーメッセージを返す
          if ((lastExecution && (now - lastExecution < 3600000) && count >= 12)) {
            return await interaction.reply('1時間に12回以上の実行はできません。');
        }

        // ユーザーの最後の実行時間と回数を更新
        userTimestamps[userId] = now;
        userCounts[userId] = (now - lastExecution < 3600000) ? count + 1 : 1;
    let autoreply = ad[Math.floor(Math.random() * ad.length)];
    try {
      await interaction.reply(autoreply);
      return;
    } catch(error) {
      await interaction.reply('宣伝を取得できませんでした。サポートに連絡して下さい。')
    }
 	},
};