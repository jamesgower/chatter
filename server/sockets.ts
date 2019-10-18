import socketIO from "socket.io";
import { generateMessage, generateLocationMessage } from "../src/utils/message";
import { isRealString } from "../src/utils/validation";
import { Users } from "../src/utils/users";

module.exports = (app): void => {
  const server = require("http").Server(app);

  const io = socketIO(server);
  const users = new Users();
  /*
      The io.on connection function is the manager which controls all connections and messages in
      the whole application. It will log a statement when a new user is connected to any room.
  */
  io.on("connection", (socket): void => {
    console.log(`New user connected at socket ${socket.id}`);

    socket.on("join", (params): void => {
      const { activeRoom, user } = params;
      let { name } = params;
      /*
        If there is more than one user in the chosen chat room with the same name as the one
        which the original user has picked, then the name will be appended with squared brackets
        and a number to make each user unique. (e.g Bill[1]).
      */
      if (users.getUserList(activeRoom).indexOf(name) > -1) {
        const usersArr = users.getUserList(activeRoom);
        const matches = usersArr.filter((currentUser): boolean => user !== currentUser)
          .length;
        name = `${name}[${matches}]`;
      }
      /*
        If there are no errors, the user will be connected to the room which is specified
        in the params.room value.
      */
      socket.join(activeRoom);
      /*
        The user is removed from all other rooms when added to the new room
      */
      users.removeUser(socket.id);
      /*
        The users' values are added to the chosen rooms' users array, and the updateUserList function is
        emitted to update the sidebar with all of the users in the rooms values. The newMessageAdmin function 
        is then emitted to alert all users apart from the current user in the room that the new user has entered 
        the room, alongside an admin message that only the current user will receive which welcomes them to the room. 
      */
      users.addUser(socket.id, name, activeRoom);
      io.to(activeRoom).emit("updateUserList", users.getUserList(activeRoom));
      socket.emit(
        "newMessageAdmin",
        generateMessage("Admin", `Welcome to the ${activeRoom} room.`),
      );
      socket.broadcast
        .to(activeRoom)
        .emit(
          "newMessageAdmin",
          generateMessage("Admin", `${name} has joined the chat room.`),
        );
    });

    /*
          The socket.on createMessage function emits an event which both sends a message which shows as a blue message, sent
          from the user to all others in the room; and a green message, which shows up to other users as a received message.
      */
    socket.on("createMessage", (message, callback): void => {
      const user = users.getUser(socket.id);
      const { name } = user;
      const { text } = message;
      if (user && isRealString(text)) {
        socket.broadcast.emit("newMessage", generateMessage(name, text));
        socket.emit("newMessageSent", generateMessage(name, text));
      }
      callback();
    });

    /*
          The socket.on createLocationMessage function emits an event which both sends a message with a link containing the users current location,
          which shows as a blue message, sent from the user to all others in the room; and a green location message, which shows up to other users 
          as a received message.
      */
    socket.on("createLocationMessage", ({ latitude, longitude }): void => {
      const user = users.getUser(socket.id);
      const { name } = user;
      if (user) {
        socket.broadcast.emit(
          "newLocationMessage",
          generateLocationMessage(name, latitude, longitude),
        );
        socket.emit(
          "newLocationMessageSent",
          generateLocationMessage(name, latitude, longitude),
        );
      }
    });

    /*
          The socket.on disconnect function updates the UserList sidebar inside the current chat room
          when a user leaves. It also emits a red message, which looks like it comes from the administrator,
          saying that the user has left the room.
      */
    socket.on("disconnect", (): void => {
      const user = users.removeUser(socket.id);
      const { activeRoom, name } = user;
      if (user) {
        io.to(activeRoom).emit("updateUserList", users.getUserList(activeRoom));
        io.to(activeRoom).emit(
          "newMessage",
          generateMessage("Admin", `${name} has left the room.`),
        );
      }
    });
  });

  const port = process.env.PORT || 5000;

  server.listen(port, (): void => {
    console.log("Server is up at port", port);
  });
};
