var express = require('express')
var path = require('path')
const notifier = require('node-notifier')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 3333 || 3000;

try {

  server.listen(port, function () {
    console.log('[server] listening at port %d', port)
  })

  io.on('connection', function (socket) {

    console.log(socket.handshake.headers);

    notifier.notify({
      'title': 'BECF',
      'message': 'Client connection'
    });
  })

} catch (e) {
  console.error(e)
}
