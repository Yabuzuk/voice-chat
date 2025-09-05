const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    io.emit('user-count', userCount);
    console.log(`Пользователь подключился. Всего: ${userCount}`);
    
    socket.on('disconnect', () => {
        userCount--;
        io.emit('user-count', userCount);
        console.log(`Пользователь отключился. Всего: ${userCount}`);
    });

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});