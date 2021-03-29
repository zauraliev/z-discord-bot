const Discord = require("discord.js");
const client = new Discord.Client();

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
});

client.login(process.env.TOKEN)

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send(`Resetting... ${client.user}`)
    .then(() => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}