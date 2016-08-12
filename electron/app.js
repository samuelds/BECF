
const server = require('./server')
const client = require('./client')

// Init
client.init()
server.init()

// check
client.check()
server.check()
if (client.shouldQuit && server.shouldQuit) {
  client.app.quit();
  return;
}

// Listeners
client.listeners()
server.listeners()
