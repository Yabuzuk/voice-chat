const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = new Map();

io.on('connection', (socket) => {
    users.set(socket.id, socket);
    console.log(`Пользователь ${socket.id} подключился. Всего: ${users.size}`);
    
    socket.on('disconnect', () => {
        users.delete(socket.id);
        console.log(`Пользователь ${socket.id} отключился. Всего: ${users.size}`);
    });

    socket.on('offer', (data) => {
        console.log(`Offer от ${socket.id}`);
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        console.log(`Answer от ${socket.id}`);
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