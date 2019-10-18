import React, { useEffect, useState, FC } from "react";
import uuid from "uuid/v4";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button, InputGroup, InputGroupAddon } from "reactstrap";
import { Socket } from "socket.io";
import { AppState } from "../store/store";
import { setUser } from "../actions/user.action";
import * as roomActions from "../actions/room.action";
import { RoomsState } from "../interfaces/components.i";

const SideBar: FC = (): JSX.Element => {
  const [users, setUsers] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  const socket = useSelector(({ room }: AppState): Socket => room.socket);
  const name = useSelector(({ user }: AppState): string => user.name);
  const room = useSelector(({ room }: AppState): RoomsState => room);
  const dispatch = useDispatch();

  const onChangeRoom = (activeRoom: string): void => {
    dispatch(roomActions.clearMessages());
    dispatch(
      setUser({
        id: socket.id,
        name,
        activeRoom,
      }),
    );
    dispatch(roomActions.changeRoom(activeRoom));

    socket.emit("join", { name, activeRoom });
  };

  const onCreateRoom = (): void => {
    dispatch(roomActions.addRoom(newRoom));
    onChangeRoom(newRoom);
    setNewRoom("");
  };

  useEffect((): void => {
    socket.on("updateUserList", (usersArr): void => {
      setUsers(usersArr);
    });
  });
  return (
    <div className="sidebar__container">
      <div className="sidebar__header">Chatter</div>
      <h3 className="sidebar__title">Users</h3>
      <div className="sidebar__users-container">
        {users.map(
          (user): JSX.Element => (
            <div className="sidebar__user" key={uuid()}>
              {user}
            </div>
          ),
        )}
      </div>
      <div className="sidebar__rooms-container">
        <h3 className="sidebar__title">Rooms</h3>
        <div className="sidebar__users-container">
          {Object.keys(room.rooms).map(
            (key): JSX.Element => {
              console.log();
              return (
                <div
                  className="sidebar__user"
                  tabIndex={0}
                  role="button"
                  key={room.rooms[key].name}
                  onClick={(): void => onChangeRoom(room.rooms[key].name)}
                >
                  {room.rooms[key].name}
                </div>
              );
            },
          )}
        </div>
      </div>
      <div className="sidebar__users-container">
        <h4 className="sidebar__create-title">Create Room</h4>
        <InputGroup>
          <Input
            placeholder="Room name..."
            value={newRoom}
            onChange={(e): void => setNewRoom(e.target.value)}
          />
          <InputGroupAddon addonType="append">
            <Button color="primary" onClick={onCreateRoom}>
              Create
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default SideBar;
