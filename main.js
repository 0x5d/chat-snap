const express = require('express')
const app = express()
app.use(express.static('public'))

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', handleConnection)

const PORT = process.env.PORT || 3000
server.listen(PORT, handleListen)

function handleConnection (socket) {
  socket.join('chat')
  socket.on('file', function (file) {
    socket.broadcast.to('chat').emit('file', file)
  })
}

function handleListen () {
  console.log('chat-snap is listening on port ' + PORT)
}
