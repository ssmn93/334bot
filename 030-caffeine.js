const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//334
const arrhis = ['https://x.com/kannu_kazufumi/status/1771521867461075305?s=20',
                'https://x.com/SekainohateGen1/status/1771419952614195605?s=20',
                'https://x.com/gamesitai4486/status/1771161991815614638?s=20',
                'https://x.com/SekainohateGen1/status/1770586890590429668?s=20',
                'https://x.com/SekainohateGen1/status/1770357856082223132?s=20',
                'https://x.com/SekainohateGen1/status/1768878869741007001?s=20',
                'https://x.com/SekainohateGen1/status/1767812941355618531?s=20',
                'https://x.com/iroha_jpeg/status/1767450345742139491?s=20',
                'https://x.com/iroha_jpeg/status/1767114438052860155?s=20',
                'https://x.com/iroha_jpeg/status/1767106484176142481?s=20',
                'https://x.com/gamesitai4486/status/1767094361802875151?s=20',
                'https://x.com/SekainohateGen1/status/1766748285237383410?s=20',
                'https://x.com/ga_la805/status/1765983292619432230?s=20',
                'https://x.com/iroha_jpeg/status/1765311911556796569?s=20',
                'https://x.com/iroha_jpeg/status/1765311911556796569?s=20',
                'https://x.com/gamesitai4486/status/1764870360057753943?s=20',
                'https://x.com/iroha_jpeg/status/1764622777322213462?s=20',
                'https://x.com/SekainohateGen1/status/1764295440126906571?s=20',
                'https://x.com/purin_RH/status/1764295195519328700?s=20',
                'https://x.com/iroha_jpeg/status/1764027210217017731?s=20',
                'https://x.com/iroha_jpeg/status/1763885543937716570?s=20',
                'https://x.com/SekainohateGen1/status/1763807150466625626?s=20',
                'https://x.com/SekainohateGen1/status/1763432715448414410?s=20',
                'https://x.com/End_of_desire/status/1763432062554677502?s=20',
                'https://x.com/iroha_jpeg/status/1763286319785209907?s=20'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('caffeine')
		.setDescription('#カフェインはいいぞ委員会'),
	async execute(interaction) {
    let autoreply = arrhis[Math.floor(Math.random() * arrhis.length)];
    await interaction.reply(autoreply);
	},
};