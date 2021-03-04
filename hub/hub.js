'use strict';

const sockio = require('socket.io');
const io = sockio(3000);

const sinkyShip = io.of('/sinky-ship');

sinkyShip.on('connection', (socket) => {
  console.log('socket connected', (socket.id));

  socket.on('guess', (payload) => {
    console.log(payload);
    socket.broadcast.emit('guess', payload);
  });

  socket.on('answer', (payload) => {
    console.log(payload);
    socket.broadcast.emit('answer', payload);
  });

  socket.on('game-over', (payload) => {
    console.log(payload);
    sinkyShip.emit('game-over', payload);
    console.log('exit');
    process.exit(1);
  });

});

