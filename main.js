const sentencer = require('sentencer');
const express = require('express')
const app = express()
app.use(express.static('public'))

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', handleConnection)

app.post('/chat', function createChat (req, res) {
  res.redirect('/chat/?id=' + sentencer.make('{{ adjective }}-{{ noun }}'))
})

const PORT = process.env.PORT || 3000
server.listen(PORT, function handleListen () {
  console.log('chat-snap is listening on port ' + PORT)
})

function handleConnection (socket) {
  socket.on('enter', function (id) {
    socket.join(id)
    socket.on('file', function (file) {
      socket.broadcast.to(id).emit('file', file)
    })
  })
}
