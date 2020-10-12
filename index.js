const express = require('express');
var socket = require('socket.io');

// app setup
const app = express();
const port = 4000;

const server = app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// serve Static files
app.use(express.static('public'));

// socket setup
var io = socket(server);

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);

  //  receive the target "chat" and send the data to all connected sockets
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });

  // receive the target "typing" and broadcast the sender's name to all OTHER sockets
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
