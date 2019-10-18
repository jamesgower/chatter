import React, { Component } from "react";
import io from "socket.io-client";
import uuid from "uuid/v4";
import { connect } from "react-redux";
import { Socket } from "socket.io";
import MessageContainer from "./Message";
import SideBar from "./SideBar";
import SendMessage from "./SendMessage";
import { ChatProps, ChatDispatchProps, Message } from "../interfaces/components.i";
import {
  SetSocketAction,
  SetUserAction,
  AddMessageAction,
  ClearMessagesAction,
  ChangeRoomAction,
  SetActiveRoomAction,
} from "../interfaces/actions.i";
import { UserProps } from "../utils/interfaces/user.i";
import * as roomActions from "../actions/room.action";
import * as userActions from "../actions/user.action";
import { getRoomVariable } from "../utils/room";

class Chat extends Component<ChatProps, {}> {
  public readonly state = {
    socket: null,
  };

  public socket: Socket;

  public componentWillMount(): void {
    const endpoint =
      process.env.NODE_ENV === "production"
        ? "https://www.james-gower.dev"
        : "http://localhost:5000";

    const {
      setSocket,
      setUser,
      user: { name, activeRoom },
      setActiveRoom,
    } = this.props;

    const socket = io(endpoint);
    setSocket(socket);
    this.setState({ socket });
    setUser({
      id: socket.id,
      name,
      activeRoom,
    });
    setActiveRoom(getRoomVariable(activeRoom));

    socket.on("connect", (): void => {
      socket.emit("join", { name, activeRoom }, (size): void => {
        roomActions.setActiveUsers(size);
      });
    });
  }

  public componentDidMount(): void {
    const { addMessage, user } = this.props;
    const { socket } = this.state;
    const { activeRoom } = user;

    document.title = `${activeRoom} | Chatter`;

    socket.on("newMessage", (message): void => {
      addMessage({ type: "message", message });
      this.scrollToBottom();
    });

    socket.on("newMessageSent", (message): void => {
      addMessage({ type: "message-sent", message });
      this.scrollToBottom();
    });

    socket.on("newMessageAdmin", (message): void => {
      addMessage({ type: "message-admin", message });
      this.scrollToBottom();
    });

    socket.on("newLocationMessage", (message): void => {
      addMessage({ type: "message", location: true, message });
      this.scrollToBottom();
    });

    socket.on("newLocationMessageSent", (message): void => {
      addMessage({ type: "message-sent", location: true, message });
      this.scrollToBottom();
    });
  }

  public componentWillUnmount(): void {
    const { socket } = this.state;
    socket.on("disconnect", (): void => {
      console.log("Disconnected from server");
    });
  }

  // FIXME PROP TYPES FOR COMPONENTS

  public scrollToBottom = (): void => {};

  public render(): JSX.Element {
    const { messages } = this.props;
    return (
      <div className="chat__container">
        <SideBar />
        <div className="chat__main">
          <div id="messages" className="chat__messages">
            {messages.map(
              (message): JSX.Element => (
                <MessageContainer {...message} key={uuid()} />
              ),
            )}
          </div>
          <SendMessage />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  user,
  user: { activeRoom: current },
  room: { activeRoom, rooms, socket },
}): ChatProps => ({
  user,
  activeRoom,
  rooms,
  socket,
  messages: current ? rooms[getRoomVariable(current)].messages : [],
});

const mapDispatchToProps = (dispatch): ChatDispatchProps => ({
  setSocket: (socket: Socket): SetSocketAction => dispatch(roomActions.setSocket(socket)),
  setUser: (user: UserProps): SetUserAction => dispatch(userActions.setUser(user)),
  addMessage: (message: Message): AddMessageAction =>
    dispatch(roomActions.addMessage(message)),
  clearMessages: (): ClearMessagesAction => dispatch(roomActions.clearMessages()),
  changeRoom: (activeRoom): ChangeRoomAction =>
    dispatch(roomActions.changeRoom(activeRoom)),
  setActiveRoom: (activeRoom): SetActiveRoomAction =>
    dispatch(roomActions.setActiveRoom(activeRoom)),
});

export default connect<ChatProps, ChatDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
