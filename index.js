const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();
const user = JSON.parse(process.env.JSON);

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
  console.log(question)
  
  const baseUrl = 'http://api.wolframalpha.com/v1/result?';
  
  let body = {
    appid: process.env.WOLFRAM_APPID,
    i: question
  }
  
  let encodedUrl = convertToEncodedUrl(body);

  return axios.get(`${baseUrl}${encodedUrl}`)
    .then(res => {
      console.log(res.data)
      return res.data;
    }).catch(error => {
      console.log(error.message)
      return "Sorry can't answer that";
    })

}

client.on("ready", () => {
  console.log(`logged in ${client.user.username}`);
  console.log(user[0].USERNAME)
});

client.on("message", msg => {
  const userRegex = /\<[@!].*?\>/g;

  if (msg.content === 'ping') msg.reply('pong');
  
  if (msg.mentions.has(client.user)) {
    
    msg.reply(`Hey there what's up? I am the ${user[1].NAME} :)!`);

    let question = `${msg.content}`.replace(userRegex, '');
    
    if (question.trim()) {
      zBotAnswer(`${question}`).then(data => {
        msg.reply(`${data}!`);
      }).catch(error => {
        msg.reply(`${error}!`);
      })
    }
  }
  if(msg.mentions.has(client.user) && msg.content.toLowerCase().includes("hello")) {
    msg.reply('Thanks for saying Hello!')
  }

  switch(msg.content.toUpperCase()) {
        case '?RST':
            resetBot(msg.channel);
            break;
  }
  if(msg.content === '$inspire') {
    getQuote().then(res => {
      msg.reply(res);
    })
  }
});

client.login(process.env.TOKEN)

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send(`Resetting...`)
    .then(() => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}

function convertToEncodedUrl(obj) {
  if (obj && Object.keys(obj).length !== 0) {
    return Object.keys(obj)
              .map(key => key + '=' + obj[key])
              .join('&');
  } else {
    return '';
  }
}