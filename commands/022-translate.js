const request = require("request");
const { Client, GatewayIntentBits, IntentsBitField, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
const Keyv = require('keyv');
const fs = require('fs');
const id = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp/content/help/detail.html?q_pid=FAQ_ETC';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('翻訳')
        .addStringOption(op =>
            op.setName('choice')
                .setDescription('選択してください')
                .addChoices(
                    { name: '日→英', value: 'JE' },
                    { name: '英→日', value: 'EJ' },
                    { name: '日→中', value: 'JC' },
                    { name: '中→日', value: 'CJ' },
                    { name: '日→イ', value: 'JI' },
                    { name: 'イ→日', value: 'IJ' },
                    { name: 'カスタム', value: 'custom' }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('content')
                .setDescription('翻訳単語を入力してください')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('from')
                .setDescription('翻訳元の言語コード(https://is.gd/Qy45Rf)を入力してください(カスタムを選択した場合)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('to')
                .setDescription('翻訳先の言語コード(https://is.gd/Qy45Rf)を入力してください(カスタムを選択した場合)')
                .setRequired(false)
        ),
    async execute(interaction) {
        // let data1 = JSON.parse(fs.readFileSync('blocked.json'));
        // if (data1[interaction.user.id]) return;
        const choice = interaction.options.getString('choice');
        const content = interaction.options.getString('content');
        await interaction.deferReply()
        if (choice == 'JE') {
          	try {
              let trans = await gasTranslate(content, "ja", "en");
              await interaction.editReply(trans);
	          } catch (error) {
		            console.error(error);
	            }
        } else if (choice == 'EJ') {
          	try {
              let trans = await gasTranslate(content, "en", "ja");
              await interaction.editReply(trans);
	          } catch (error) {
		            console.error(error);
	            }
        } else if (choice == 'JC') {
          	try {
              let trans = await gasTranslate(content, "ja", "zh-CN");
              await interaction.editReply(trans);
	          } catch (error) {
		            console.error(error);
	            }
        } else if (choice == 'CJ') {
          try {
            let trans = await gasTranslate(content, "zh-CN", "ja");
            await interaction.editReply(trans);
          } catch(error) {
            console.error(error);
          }
        } else if (choice == 'JI') {
          try {
            let trans = await gasTranslate(content, "ja", "id");
            await interaction.editReply(trans);
          } catch(error) {
              console.error(error);
          }
        } else if (choice == 'IJ') {
          try {
             let trans = await gasTranslate(content, 'id', 'ja');
             await interaction.editReply(trans);
          } catch(error) {
              console.error(error);
          }
        } else if (choice == 'custom') {
          const from = interaction.options.getString('from');
          const to = interaction.options.getString('to');
          	try {
              let trans = await gasTranslate(content, from, to);
              if (trans.includes('<title>Error</title>')) {
                await interaction.editReply(`翻訳コードの設定にミスがある可能性があります。コード一覧は[こちら](<${id}>)から`)
                return;
              }
              await interaction.editReply(trans);
	          } catch (error) {
		            await interaction.editReply(`翻訳コードの設定にミスがある可能性があります。コード一覧は[こちら](<${id}>)から`)
                return;
	            }
        }
    }
}

function gasTranslate (text, source, target) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://script.google.com/macros/s/AKfycbz4kys9lblGHlt0U4XpQYDVEpr5TyvaCZjcmArCAlaO8QopvWzfBHv7YchUG202OE5P/exec?text=${encodeURIComponent(text)}&source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`,
            json: true
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}