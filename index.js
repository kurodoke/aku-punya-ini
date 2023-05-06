const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Events, SlashCommandBuilder, Collection } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus, PlayerSubscription } = require('@discordjs/voice');
const alwaysOn = require("./server.js")

//.env
require('dotenv').config();

//client construct
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

//command manager
function commandsFind(command) {
  const commandsPath = path.join(__dirname, '/app/commands');
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
let cur;
client.on(Events.MessageCreate, (msg) => {
  if (msg.content == "aku punya ini") {
    connection = joinVoiceChannel({
      channelId: msg.member.voice.channelId,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });
    msg.channel.send("okeh");

    let vidPath = path.join(__dirname, "/app/vid/202305052128.mp4");
    let resource = createAudioResource(vidPath);
    player.play(resource);
    connection.subscribe(player);
    cur = msg.content
  }

  if (msg.content == "rame bangets") {
    connection = joinVoiceChannel({
      channelId: msg.member.voice.channelId,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });
    msg.channel.send("okeh");

    let vidPath = path.join(__dirname, "/app/vid/363116019370444.mp4");
    let resource = createAudioResource(vidPath);
    player.play(resource);
    connection.subscribe(player);
    cur = msg.content;
  }

  if (msg.content == "bang bang udah bang") {
    if (connection) {
      player.stop();
      connection.destroy();
      cur = null;
      msg.channel.send("iya");
    } else {
      msg.channel.send("apa coba");
    }
  }
});

player.on(AudioPlayerStatus.Idle, () => {
  player.stop();
  let vidPath;
  console.log(cur);
  if (cur == "aku punya ini") {
    vidPath = path.join(__dirname, "/app/vid/202305052128.mp4");
  } else if (cur == "rame bangets") {
    vidPath = path.join(__dirname, "/app/vid/363116019370444.mp4");
  }
  let resource = createAudioResource(vidPath);
  player.play(resource);
  connection.subscribe(player);
})

player.on(AudioPlayerStatus.AutoPaused, () => {
  //console.log("auto");
})

alwaysOn();
client.login(process.env.TOKEN);