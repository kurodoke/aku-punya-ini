const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Events, SlashCommandBuilder, Collection } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus, PlayerSubscription} = require('@discordjs/voice');

//.env
require('dotenv').config();

//client construct
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates
] });

//command manager
function commandsFind(command) {
	const commandsPath = path.join(__dirname,'/app/commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
	}
}


//client event
client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


const player = createAudioPlayer();
let connection;
client.on(Events.MessageCreate, (msg) => {
	if (msg.content == "aku punya ini"){
		connection = joinVoiceChannel({
			channelId : msg.member.voice.channelId,
			guildId : msg.guild.id,
			adapterCreator : msg.guild.voiceAdapterCreator
		});
		msg.channel.send("okeh");

		let vidPath = path.join(__dirname, "/app/vid/0505.mp4");
		let resource = createAudioResource(vidPath);
		player.play(resource);
		connection.subscribe(player);
	}

	if (msg.content == "bang bang udah bang"){
		if (connection) {
			player.stop();
			connection.destroy();
			msg.channel.send("iya");
		} else {
			msg.channel.send("udah");
		}
	}
});

player.on(AudioPlayerStatus.Idle, () => {
	player.stop();
	let vidPath = path.join(__dirname, "/app/vid/0505.mp4");
	let resource = createAudioResource(vidPath);
	player.play(resource);
	connection.subscribe(player);
})

player.on(AudioPlayerStatus.AutoPaused, () => {
	//console.log("auto");
})


client.login(process.env.TOKEN);