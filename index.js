const Discord = require("discord.js");
const WolframAlphaAPI = require("wolfram-alpha-api");
// const waApi = WolframAlphaAPI(`${process.env.WOLFRAM_APPID}`);
const fetch = require("node-fetch");
const client = new Discord.Client();
require("dotenv").config();

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json();
    })
    .then(data => {
      return `${data[0]["q"]} -${data[0]["a"]}`
    })
}

function zBotAnswer(question) {
  return fetch(`http://api.wolframalpha.com/v2/query?input=${question}&appid=${process.env.WOLFRAM_APPID}`)
  .then(res=>{
    return res.json()
  })
  .then(data => {
    return data
  })
}


client.on("ready", () => {
  console.log(`logged in ${client.user.username}`);
});

client.on("message", msg => {
  if(msg.content === "ping") msg.reply("pong");
  if(msg.mentions.has(client.user)) {
    msg.reply("Hey there what's up!");
    let question = `${msg.content}`
    .replace(`<@${client.user.id}>`,'')
    if(question.trim()) {
      msg.reply(`${question.trim()} to you!`)
    }
  }
  if(msg.mentions.has(client.user) && msg.content.includes("hello")) {
    msg.reply("Thanks for for saying Hello!")
  }




  switch(msg.content.toUpperCase()) {
        case '?RST':
            resetBot(msg.channel);
            break;
  }
  if(msg.content === "$inspire") {
    getQuote().then(res => {
      msg.reply(res);
    })
  }
});

client.login(process.env.TOKEN)

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send(`Resetting... ${client.user}`)
    .then(() => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}