const socket = io();

function scrollToBottom() {
	//:Selectors
	const messages = jQuery('#messages');
	const newMessage = messages.children('li:last-child');
	//:Heights
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	const params = jQuery.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
	const ol = jQuery('<ol></ol>');
	users.forEach(function(user) {
		ol.append(jQuery('<li></li>').text(user));
	});
	jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#message-template').html();
	const html = Mustache.render(template, {
		sender: message.sender,
		text: message.text,
		createdAt: formattedTime,
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newMessageSent', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');	
	const template = jQuery('#message-template-sent').html();
	const html = Mustache.render(template, {
		sender: message.sender, 
		text: message.text,
		createdAt: formattedTime,
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#location-message-template').html();
	const html = Mustache.render(template, {
		sender: message.sender,
		createdAt: formattedTime,
		url: message.url,
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessageSent', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#location-message-template-sent').html();
	const html = Mustache.render(template, {
		sender: message.sender,
		createdAt: formattedTime,
		url: message.url,
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();
	const messageTextbox = jQuery('[name=message]');
	socket.emit(
		'createMessage',
		{
			text: messageTextbox.val(),
		},
		function() {
			messageTextbox.val('');
		}
	);
});

const locationButton = jQuery('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending Location...');

	navigator.geolocation.getCurrentPosition(
		function(position) {
			locationButton.removeAttr('disabled').text('Send Location');
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},
		function() {
			locationButton.removeAttr('disabled').text('Send Location');
			alert('Unable to fetch location');
		}
	);
});
