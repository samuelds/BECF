module.exports = {
  express: require('express'),
  path: require('path'),
  portfinder: require('portfinder'),
  http: require('http'),
  socket: require('socket.io'),

  app: null,
  server: null,
  io: null,

  port: 46148,
  shouldQuit: false,

  run: function () {
    this.server = this.http.createServer(this.app)
    this.io = this.socket(this.server)
  },

  listeners: function () {
    var self = this
    this.server.listen(this.port, function () {
      console.log('[Server] listening at port %d', self.port)
    })
  },

  check: function () {
    var self = this
    this.portfinder.getPort(function (err, port) {
      if (port !== self.port) self.shouldQuit = true
    })
  },

  init: function () {
    this.app = this.express()
    this.portfinder.basePort = this.port
  }

}
