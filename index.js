const Discord = require('discord.js')
const config = require('dotenv').config().parsed
const {spacebotHandler} = require("./spaceBot/spacebot")
const {eventbotHandler} = require("./eventBot/eventbot")

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  // Only reply to messages with prefix
  if (msg.content.startsWith(config.PREFIX)){
    const key = msg.content.replace(config.PREFIX,"");
    console.log(key);
    switch (key) {
      case "space":
        spacebotHandler(msg);
        break;
      case "event":
        eventbotHandler(msg);
        break;
      default:
        break;
    }
  }
    
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(config.BOT_TOKEN);