const sentencer = require('sentencer')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.post('/chat', (req, res) => {
  const sessionId = sentencer.make('{{ adjective }}-{{ noun }}')
  res.redirect(`/chat/?id=${sessionId}`)
})

io.on('connection', handleConnection)

server.listen(PORT, () => console.log(`chat-snap is listening on port ${PORT}`))

function handleConnection (socket) {
  socket.on('enter', id => {
    socket.join(id)
    socket.on('file', file => socket.broadcast.to(id).emit('file', file))
  })
}
