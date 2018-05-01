var socket = io();

socket.on('connect', function() {
	console.log('Connected to server.');

	socket.emit('createMessage', {
		from: 'james@example.com',
		text: 'Test message',
		createdAt: 123
	});
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
	console.log('Message received:', message);
});
