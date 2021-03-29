const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();


function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json();
    })
    .then(data => {
      return `${data[0]["q"]} -${data[0]["a"]}`
    })
}


client.on("ready", () => {
  console.log(`logged in ${client.user.tag}`);
});

client.on("message", msg => {
  if(msg.content === "ping") msg.reply("pong");
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