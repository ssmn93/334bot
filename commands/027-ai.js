const request = require("request");
const { Client, GatewayIntentBits, IntentsBitField, SlashCommandBuilder } = require('discord.js');
const { token } = process.env.logintoken
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('AIと会話ができます')
    .addStringOption(option =>
        option.setName('content')
            .setDescription('会話内容')
            .setRequired(true)
      ),
async execute(interaction) {
  interaction.deferReply();
  const content = interaction.options.getString('content');
    try {
        let meboResult = await mebo(interaction.channel.id, content);
        interaction.editReply(meboResult.bestResponse.utterance);
	  } catch (error) {
		  console.error(error);
	  }
}
}
function mebo(chId, msg) {
    return new Promise((resolve, reject) => {
        request({
            url: "https://api-mebo.dev/api",
            method: "POST",
            json: {
                api_key: "9150db75-0b47-466a-b10f-a2ee32f36a0318e30909ef3261",
                agent_id: "36dd17c5-cf3f-42c7-93c6-2b6e2a05b54d18e308a7bdf65",
                utterance: msg,
                uid: chId
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}