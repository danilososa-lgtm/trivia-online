const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('createRoom', ({ playerName }) => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    rooms[code] = {
      players: [{ id: socket.id, name: playerName }],
      started: false
    };
    socket.join(code);
    socket.emit('roomCreated', { code });
  });

  socket.on('joinRoom', ({ code, playerName }) => {
    if (rooms[code]) {
      rooms[code].players.push({ id: socket.id, name: playerName });
      socket.join(code);
      io.to(code).emit('playerJoined', rooms[code].players);
    }
  });

  socket.on('startGame', ({ code }) => {
    rooms[code].started = true;
    io.to(code).emit('gameStarted');
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor corriendo en puerto 4000');
});