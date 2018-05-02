const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', socket => {
	console.log('New user connected.');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chat room.'));

	socket.on('createMessage', (message, callback) => {
		console.log('New message:', message);
		io.emit('newMessage', generateMessage(message.sender, message.text));
		callback();
	});

	socket.on('createLocationMessage', coords => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', socket => {
		console.log('User was disconnected.');
	});
});

server.listen(port, () => {
	console.log(`Server is up at port ${port}`);
});
