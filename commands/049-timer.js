const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, Events } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('タイマー')
        .addStringOption(op =>
            op.setName('type')
                .setDescription('タイマーの種類を選択')
                .setRequired(true)
                .addChoices(
                    { name: 'alarm', value: 'alarm' },
                    { name: 'timer', value: 'timer' }
                )
        )
        .addStringOption(op =>
            op.setName('mention')
                .setDescription('メンションの有無を選択')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'on' },
                    { name: 'off', value: 'off' }
                )
        )
        .addStringOption(op =>
            op.setName('month')
                .setDescription('実行する月を入力して下さい(1月…1、12月…12)')
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('day')
                .setDescription('実行する日を入力して下さい(1日…1、31日…31)')
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('hour')
                .setDescription('実行する時間を入力して下さい(1時…1、23時…23)')
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('minute')
                .setDescription('実行する分を入力して下さい(1分…1、59分…59)')
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('second')
                .setDescription('実行する秒を入力して下さい(1秒…1、59秒…59)')
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName('content')
                .setDescription('送信する内容を入力して下さい')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const type = interaction.options.getString('type');
        const mention = interaction.options.getString('mention');
        let userid;
        if (mention == 'on') {
            userid = interaction.user.id;
        } else if (mention == 'off') {
            userid = 'null';
        } else {
            await interaction.editReply('無効な選択');
            return;
        }

        const month = parseInt(interaction.options.getString('month'), 10);
        const day = parseInt(interaction.options.getString('day'), 10);
        const hour = parseInt(interaction.options.getString('hour'), 10);
        const minute = parseInt(interaction.options.getString('minute'), 10);
        const second = parseInt(interaction.options.getString('second'), 10);
        const content = interaction.options.getString('content') || 'null';

        if (isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
            await interaction.editReply({ content: 'エラー 各項目には数字のみを入力して下さい', ephemeral: true });
            return;
        }

        const now = new Date();
        let targetDate;
        if (type === 'alarm') {
            if (month == 0 || month > 12) return await interaction.editReply('アラーム(時刻での指定)のため、monthは有効な月にしてください。');
            targetDate = new Date(now.getFullYear(), month - 1, day, hour, minute, second);
        } else if (type === 'timer') {
            targetDate = new Date(now.getTime() + (month * 30 * 24 * 60 * 60 * 1000) + (day * 24 * 60 * 60 * 1000) + (hour * 60 * 60 * 1000) + (minute * 60 * 1000) + (second * 1000));
        } else {
            await interaction.editReply({ content: 'エラー 無効なタイマーの種類です', ephemeral: true });
            return;
        }

        const delay = targetDate - now;

        if (delay <= 0) {
            await interaction.editReply({ content: 'エラー 過去の時間を指定することはできません', ephemeral: true });
            return;
        }

        const channel = interaction.channel.id;
        if (!channel) {
            await interaction.editReply({ content: 'エラー DMで実行されていないか確認して下さい', ephemeral: true });
            return;
        }

        let guild = interaction.guild ? interaction.guild.id : null;

        if (!guild) {
            await interaction.editReply({ content: 'エラー DMではこのコマンドを使用できません', ephemeral: true });
            return;
        }

        let data = [];
        const filePath = path.join(__dirname, 'timer.json');
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        function countMatchingElements(data, key, value) {
            return data.filter(element => element[key] === value).length;
        }

        const count = countMatchingElements(data, 'guild', interaction.guild.id);

        const newEntry = { month, day, hour, minute, second, channel, guild, content, userid, type, targetDate: targetDate.toISOString() };
        data.push(newEntry);
        fs.writeFileSync(filePath, JSON.stringify(data));

        setTimer(newEntry, interaction.client);

        await interaction.editReply('登録が完了しました');
    }
};

function setTimer(entry, client) {
    const { channel, content, userid, targetDate } = entry;
    const now = new Date();
    const targetDateObj = new Date(targetDate);
    const delay = targetDateObj - now;

    if (delay > 0) {
        const MAX_DELAY = 2147483647;

        function recursiveTimeout(delay) {
            if (delay > MAX_DELAY) {
                setTimeout(() => {
                    recursiveTimeout(delay - MAX_DELAY);
                }, MAX_DELAY);
            } else {
                setTimeout(async () => {
                    const targetChannel = await client.channels.fetch(channel);
                    let mcontent = userid === 'null' ? content : `<@${userid}>\n${content}`;
                    if (targetChannel) {
                        targetChannel.send(mcontent);
                    }
                }, delay);
            }
        }

        recursiveTimeout(delay);
    }
}

// 追加: setTimerとremoveTimerをエクスポートする
module.exports.setTimer = setTimer;