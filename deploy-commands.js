const { REST, Routes } = require('discord.js');
const { clientId } = require('./config.json');
const token = process.env.logintoken;
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`${commands.length} 個のアプリケーションコマンドを登録します。`);

		const data = await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);

		console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
    return;
	} catch (error) {
		console.error(error);
	}
})();