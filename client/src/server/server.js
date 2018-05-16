const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected.');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        socket.join(params.room); //joins the room which was specified in index.html params
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room)
        io
            .to(params.room)
            .emit('updateUserList', users.getUserList(params.room));
        // socket.leave(params.room); //will leave the targeted room
        // io.to(params.room).emit //sends an event to everybody in the targeted room
        // socket.broadcast.to(params.room).emit //sends a message to everybody in the
        // targeted room apart from the one that sent it
        socket.emit('newMessageAdmin', generateMessage('Admin', `Welcome to the ${params.room} room.`));
        socket
            .broadcast
            .to(params.room)
            .emit('newMessageAdmin', generateMessage('Admin', `${params.name} has joined the chat room.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id)

        if (user && isRealString(message.text)) {
            socket
                .broadcast
                .emit('newMessage', generateMessage(user.name, message.text));
            socket
                .emit('newMessageSent', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', coords => {
        const user = users.getUser(socket.id);
        if (user) {
            socket
                .broadcast
                .emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude)); //send as a recieved message to all users in room but sender
            socket.emit('newLocationMessageSent', generateLocationMessage(user.name, coords.latitude, coords.longitude)); // looks as if user has sent the message (different colour and side)
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io
                .to(user.room)
                .emit('updateUserList', users.getUserList(user.room));
            io
                .to(user.room)
                .emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});