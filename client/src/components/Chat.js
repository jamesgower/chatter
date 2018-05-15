import React from 'react';
import io from 'socket.io-client';
import jQuery from 'jquery';
import moment from 'moment';
import Mustache from 'mustache';
import '../css/styles.css';

window.jQuery = jQuery;

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            endpoint: 'http://localhost:5000'
        };
    }

    render() {

        const socket = io(this.state.endpoint);

        function scrollToBottom() {
            //:Selectors
            const messages = jQuery('#messages');
            const newMessage = messages.children('li:last-child');
            //:Heights
            let clientHeight = messages.prop('clientHeight');
            let scrollTop = messages.prop('scrollTop');
            let scrollHeight = messages.prop('scrollHeight');
            let newMessageHeight = newMessage.innerHeight();
            let lastMessageHeight = newMessage
                .prev()
                .innerHeight();

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                messages.scrollTop(scrollHeight);
            }
        }

        const params = this.props.params;

        socket.on('connect', function () {
            socket
                .emit('join', params, function (err) {
                    if (err) {
                        alert(err);
                    } else {
                        console.log('No error');
                    }
                });
        });

        socket.on('disconnect', function () {
            console.log('Disconnected from server');
        });

        socket.on('updateUserList', function (users) {
            const ol = jQuery('<ol></ol>');
            users.forEach(function (user) {
                ol.append(jQuery('<li></li>').text(user));
            });
            jQuery('#users').html(ol);
        });

        socket.on('newMessage', function (message) {
            const formattedTime = moment(message.createdAt).format('h:mm a');
            const template = jQuery('#message-template').html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime
            });
            jQuery('#messages').append(html);
            scrollToBottom();
        });

        socket.on('newMessageSent', function (message) {
            const formattedTime = moment(message.createdAt).format('h:mm a');
            const template = jQuery('#message-template-sent').html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime
            });
            jQuery('#messages').append(html);
            scrollToBottom();
        });

        socket.on('newMessageAdmin', function (message) {
            const formattedTime = moment(message.createdAt).format('h:mm a');
            const template = jQuery('#message-template-admin').html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime
            });
            jQuery('#messages').append(html);
            scrollToBottom();
        });

        socket.on('newLocationMessage', function (message) {
            const formattedTime = moment(message.createdAt).format('h:mm a');
            const template = jQuery('#location-message-template').html();
            const html = Mustache.render(template, {
                sender: message.sender,
                createdAt: formattedTime,
                url: message.url
            });
            jQuery('#messages').append(html);
            scrollToBottom();
        });

        socket.on('newLocationMessageSent', function (message) {
            const formattedTime = moment(message.createdAt).format('h:mm a');
            const template = jQuery('#location-message-template-sent').html();
            const html = Mustache.render(template, {
                sender: message.sender,
                createdAt: formattedTime,
                url: message.url
            });
            jQuery('#messages').append(html);
            scrollToBottom();
        });

        function onTextSubmit(e) {
            e.preventDefault();
            const messageTextbox = jQuery('[name=message]');
            socket.emit('createMessage', {
                text: messageTextbox.val()
            }, function () {
                messageTextbox.val('');
            });
        };


        function onLocationPress() {
            const locationButton = document.getElementById('send-location');

            if (!navigator.geolocation) {
                return alert('Geolocation not supported by your browser');
            }

            locationButton.disabled = true;
            locationButton.innerText = 'Sending Location...';

            navigator
                .geolocation
                .getCurrentPosition(function (position) {
                    locationButton.disabled = false;
                    locationButton.innerText = 'Send Location'
                    socket.emit('createLocationMessage', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }, function () {
                    locationButton.disabled = false;
                    locationButton.innerText = 'Send Location'
                    alert('Unable to fetch location');
                });
        };

        return (
            <div className="chat">
                <div className="chat__sidebar">
                    <h3>People</h3>
                    <div id="users"></div>
                </div>

                <div className="chat__main">
                    <ol id="messages" className="chat__messages"></ol>
                    <div className="chat__footer">
                        <form onSubmit={(e) => onTextSubmit(e)}>
                            <input name="message" placeholder="Message" autoFocus autoComplete="off"/>
                            <button className="button__chatter" type="submit">Send</button>
                            <button
                                className="button__chatter"
                                id="send-location"
                                onClick={() => onLocationPress()}>Send Location</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat;