const Discord = require("discord.js");
const Database = require("@replit/database")


const client = new Discord.Client();
const db = new Database()

const axios = require("axios");
require("dotenv").config();
const user = JSON.parse(process.env.JSON);

const sadWords = ["sad", "depressed", "unhappy", "angry"];

const initMotivations = [
  "Cheer up!",
  "Be motivated!",
  "Hang in there!"
];

db.get("motivations").then(motivations => {
  if(!motivations || motivations.length < 1){
    db.set("motivations", initMotivations);
    console.log(motivations)
  }
  console.log(motivations)
})


function updateMotivation(motivationMSG) {
  db.get("motivations").then(motivations =>{
    motivations.push(motivationMSG);
    db.set("motivations", motivations)
      .then(() => {
        db.get("motivations").then(motivations => {
          console.log(motivations)
        })
      })
  })
}

function deleteMotivation(index) {
  db.get("motivations").then(motivations => {
    if(motivations.length > index) {
      motivations.splice(index, 1)
      db.set("motivations", motivations)
        .then(() => {
          db.get("motivations").then(motivations => {
            console.log(motivations)
          })
        })
    }
  })
}


function getQuote() {
  
  return axios.get('https://zenquotes.io/api/random')
              .then(res => {
                return `${res.data[0]["q"]} -${res.data[0]["a"]}`;
              })
              .catch(error => {
                console.log(error.message)
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
              })
              .catch(error => {
                console.log(error.message)
                return "Sorry can't answer that";
              })
}

client.on("ready", () => {
  console.log(`logged in ${client.user.username}`);
});

client.on("message", msg => {
  const userRegex = /\<[@!].*?\>/g;

  if (msg.content === 'ping') msg.reply('pong');

  if (sadWords.some(word => msg.content.includes(word))) {
    db.get("motivations").then(motivations => {
      const motivation = motivations[Math.floor(Math.random() * motivations.length)];
      msg.reply(motivation);
    })
  }

  if(msg.content.startsWith("$new")) {
    motivationMSG = msg.content.split("$new ")[1];
    updateMotivation(motivationMSG);
    msg.channel.send("New motivational message added...")
  }

  if(msg.content.startsWith("$del")) {
    index = msg.content.split("$del ")[1];
    deleteMotivation(index);
    msg.channel.send("New motivational message deleted...")
  }
  
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