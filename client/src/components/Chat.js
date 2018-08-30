import React from "react";
import io from "socket.io-client";
import jQuery from "jquery";
import moment from "moment";
import Mustache from "mustache";
import "../css/styles.css";

window.jQuery = jQuery;

class Chat extends React.Component {
    constructor(props) {
        super(props);

        /*
            If the NODE_ENV is set to production, then use the port which Heroku automatically chooses.
            If there is no NODE_ENV set, then the environment is production, so the endpoint should be
            set to the local server port - localhost:5000.
        */
        this.state = {
            endpoint:
                process.env.NODE_ENV === "production" ? process.env.PORT : "http://localhost:5000",
        };
    }

    render() {
        document.title = `${this.props.params.room} | Chatter`;
        /*
            The socket constant is the reference to what is returned from creating a new manager for the 
            given URL, whether that is localhost:5000 or the port which Heroku chooses depends on which
            endpoint is chosen above.
        */
        const socket = io(this.state.endpoint);

        /*
          The scrollToBottom function scrolls to the bottom of the page when a new message is sent or 
          received, so no new messages will be missed if the user is not looking at the window.  
        */
        function scrollToBottom() {
            // Selectors
            const messages = jQuery("#messages");
            const newMessage = messages.children("li:last-child");

            // Heights
            let clientHeight = messages.prop("clientHeight");
            let scrollTop = messages.prop("scrollTop");
            let scrollHeight = messages.prop("scrollHeight");
            let newMessageHeight = newMessage.innerHeight();
            let lastMessageHeight = newMessage.prev().innerHeight();

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                messages.scrollTop(scrollHeight);
            }
        }

        /*
            The params constant contains all connection information sent from the Landing component,
            it contains the room name which is trying to be connected to, and the name of the user(s)
            in the room.
        */
        const params = this.props.params;

        /*
            The socket.on function connects the server, and joins the chosen room from the parameters passed down
            via props from the Landing component. Any error will be alerted to the user.
        */
        socket.on("connect", function() {
            socket.emit("join", params, function(err) {
                if (err) {
                    alert(err);
                } else {
                    console.log("No error");
                }
            });
        });

        /*
            The socket.on disconnect function disconnects the user from the server.
        */
        socket.on("disconnect", function() {
            console.log("Disconnected from server");
        });

        /* 
            The socket.on updateUserList function updates the Users sidebar with all of the 
            users in the room when one enters or leaves it.
        */
        socket.on("updateUserList", function(users) {
            const ol = jQuery("<ol></ol>");
            users.forEach(function(user) {
                ol.append(jQuery("<li></li>").text(user));
            });
            jQuery("#users").html(ol);
        });

        /*
            The socket.on newMessage function emits a new message which renders a green received message
            to fit the "message-template" mustache template in the index.html file.
        */
        socket.on("newMessage", function(message) {
            const formattedTime = moment(message.createdAt).format("h:mm a");
            const template = jQuery("#message-template").html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime,
            });
            jQuery("#messages").append(html);
            scrollToBottom();
        });

        /*
            The socket.on newMessageSent function emits a new message which renders a blue sent message to 
            fit the "message-template-sent" mustache template in the index.html file.
        */
        socket.on("newMessageSent", function(message) {
            const formattedTime = moment(message.createdAt).format("h:mm a");
            const template = jQuery("#message-template-sent").html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime,
            });
            jQuery("#messages").append(html);
            scrollToBottom();
        });

        /*
            The socket.on newMessageAdmin function emits a new message which renders a red admin message to 
            fit the "message-template-admin" mustache template in the index.html file.
        */
        socket.on("newMessageAdmin", function(message) {
            const formattedTime = moment(message.createdAt).format("h:mm a");
            const template = jQuery("#message-template-admin").html();
            const html = Mustache.render(template, {
                sender: message.sender,
                text: message.text,
                createdAt: formattedTime,
            });
            jQuery("#messages").append(html);
            scrollToBottom();
        });

        /*
            The socket.on newLocationMessage function emits a new message which renders a green received 
            message, to fit the "location-message-template" mustache template in the index.html file.
        */
        socket.on("newLocationMessage", function(message) {
            const formattedTime = moment(message.createdAt).format("h:mm a");
            const template = jQuery("#location-message-template").html();
            const html = Mustache.render(template, {
                sender: message.sender,
                createdAt: formattedTime,
                url: message.url,
            });
            jQuery("#messages").append(html);
            scrollToBottom();
        });

        /*
            The socket.on newLocationMessageSent function emits a new message which renders a 
            blue sent message, to fit the "location-message-template-sent" mustache template in the index.html file.
        */
        socket.on("newLocationMessageSent", function(message) {
            const formattedTime = moment(message.createdAt).format("h:mm a");
            const template = jQuery("#location-message-template-sent").html();
            const html = Mustache.render(template, {
                sender: message.sender,
                createdAt: formattedTime,
                url: message.url,
            });
            jQuery("#messages").append(html);
            scrollToBottom();
        });

        /*
            The onTextSubmit function retrieves the value from the textbox named "message", and
            then renders a blue sent message to match the "message-template-sent" mustache template
            in the index.html file. It then clears the textbox, so the user doesn't have to manually
            remove the text from the input.
        */
        function onTextSubmit(e) {
            e.preventDefault();
            const messageTextbox = jQuery("[name=message]");
            socket.emit(
                "createMessage",
                {
                    text: messageTextbox.val(),
                },
                function() {
                    messageTextbox.val("");
                },
            );
        }

        /*
            The onLocationPress button tries to send the current users geolocation. For the 
            function to work, the user must agree to have their location sent, by clicking allow.
            If the user is using an old browser, then they will be alerted that this feature isn't 
            supported. If the user does allow the geolocation service, then the locationButton is
            disabled while the server sends the current location over.
        */
        function onLocationPress() {
            const locationButton = document.getElementById("send-location");

            if (!navigator.geolocation) {
                return alert("Geolocation not supported by your browser");
            }

            locationButton.disabled = true;
            locationButton.innerText = "Sending Location...";

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    locationButton.disabled = false;
                    locationButton.innerText = "Send Location";
                    socket.emit("createLocationMessage", {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                function() {
                    locationButton.disabled = false;
                    locationButton.innerText = "Send Location";
                    alert("Unable to fetch location");
                },
            );
        }

        return (
            <div className="chat">
                <div className="chat__sidebar">
                    <h3 style={{ textDecoration: "underline" }}>Users</h3>
                    <div id="users" />
                </div>

                <div className="chat__main">
                    <ol id="messages" className="chat__messages" />
                    <div className="chat__footer">
                        <form onSubmit={e => onTextSubmit(e)}>
                            <input
                                name="message"
                                placeholder="Message"
                                autoFocus
                                autoComplete="off"
                            />
                            <button className="button__chatter" type="submit">
                                Send
                            </button>
                            <br className="visible-sm" />
                            <button
                                className="button__chatter location-button"
                                id="send-location"
                                onClick={() => onLocationPress()}
                            >
                                Send Location
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
