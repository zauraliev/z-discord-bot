const express = require("express");

const server = express();

server.all("/", (req, res) => {
  res.send("Z-Bot is running...");
})

const keepAlive = () => {
  server.listen(7777, () => {
    console.log("Server is ready...");
  })
}

module.exports = {
  keepAlive: keepAlive
}