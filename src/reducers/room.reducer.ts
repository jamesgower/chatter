import { RoomsState } from "../interfaces/components.i";
import {
  ChangeRoomAction,
  CHANGE_ROOM,
  SetSocketAction,
  SET_SOCKET,
  AddMessageAction,
  ADD_MESSAGE,
  ClearMessagesAction,
  CLEAR_MESSAGES,
  SET_ACTIVE_ROOM,
  SetActiveRoomAction,
  ADD_ROOM,
  AddRoomAction,
} from "../interfaces/actions.i";
import { getRoomVariable } from "../utils/room";

type RoomActionsTypes =
  | ChangeRoomAction
  | SetSocketAction
  | AddMessageAction
  | ClearMessagesAction
  | SetActiveRoomAction
  | AddRoomAction;

const defaultRoomState: RoomsState = {
  socket: null,
  rooms: {
    react: {
      name: "React & Redux",
      messages: [],
      activeUsers: 0,
    },
    es6: {
      name: "ES6+ JavaScript",
      messages: [],
      activeUsers: 0,
    },
    frameworks: {
      name: "New Frameworks",
      messages: [],
      activeUsers: 0,
    },
    discuss: {
      name: "Discuss",
      messages: [],
      activeUsers: 0,
    },
    design: {
      name: "Design Ideas",
      messages: [],
      activeUsers: 0,
    },
    chill: {
      name: "Chill Zone",
      messages: [],
      activeUsers: 0,
    },
  },
  currentRoom: null,
};

export default (state = defaultRoomState, action: RoomActionsTypes): RoomsState => {
  switch (action.type) {
    case SET_ACTIVE_ROOM: {
      const { activeRoom } = action;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [activeRoom]: {
            ...state.rooms[activeRoom],
            activeUsers: state.rooms[activeRoom].activeUsers + 1,
          },
        },
        currentRoom: activeRoom,
      };
    }
    case CHANGE_ROOM: {
      const prevRoomName = state.currentRoom;
      const prevRoom = state.rooms[prevRoomName];
      const nextRoomName = getRoomVariable(action.newRoom);
      const nextRoom = state.rooms[nextRoomName];
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [prevRoomName]: {
            ...prevRoom,
            activeUsers: prevRoom.activeUsers - 1,
          },
          [nextRoomName]: {
            ...nextRoom,
            activeUsers: nextRoom.activeUsers + 1,
          },
        },
        currentRoom: getRoomVariable(action.newRoom),
      };
    }
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case ADD_MESSAGE: {
      const currentRoomName = state.currentRoom;
      const currentRoom = state.rooms[currentRoomName];
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [currentRoomName]: {
            ...currentRoom,
            messages: [...currentRoom.messages, action.message],
          },
        },
      };
    }
    case CLEAR_MESSAGES: {
      const currentRoomName = state.currentRoom;
      const currentRoom = state.rooms[currentRoomName];
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [currentRoomName]: {
            ...currentRoom,
            messages: [],
          },
        },
      };
    }
    case ADD_ROOM: {
      const { name } = action;
      const nameVar = name.split(" ")[0];
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [nameVar]: {
            name,
            activeUsers: 0,
            messages: [],
          },
        },
        currentRoom: nameVar,
      };
    }
    default:
      return state;
  }
};
