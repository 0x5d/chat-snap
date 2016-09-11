var express = require('express');

var app = express();
app.use(express.static('public'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.join('chat');
  socket.on('file', function (file) {
    socket.broadcast.to('chat').emit('file', file);
  });
});

server.listen(process.env.PORT || 3000);