import { Socket } from "socket.io";
import { UserProps } from "../utils/interfaces/user.i";

export interface ChatterState {
  room?: RoomsState;
  user?: UsersState;
}

export interface UsersState {
  id?: string;
  name?: string;
  activeRoom?: string;
}

export interface LandingState {
  name: string;
  room: string;
  nameError: boolean;
  roomError: boolean;
  dropdownOpen: boolean;
  submitted: boolean;
}

export interface LandingDispatchProps {
  setUser: (user) => void;
  addRoom: (name) => void;
}

export interface RoomsState {
  socket?: Socket;
  currentRoom: string;
  rooms: {
    [x: string]: {
      name: string;
      activeUsers: number;
      messages: Message[];
    };
  };
}

interface RoomProps {
  name: string;
  messages: MessageProps[];
  activeUsers: number;
}

export interface ChatProps {
  activeRoom: string;
  room?: RoomsState;
  chosenRoom?: string;
  rooms: RoomProps;
  user?: UserProps;
  name?: string;
  socket?: Socket;
  messages?: MessageProps[];
  setSocket?: (socket: Socket) => void;
  setUser?: (user: UserProps) => void;
  addMessage?: (message: MessageProps) => void;
  setActiveRoom?: (activeRoom: string) => void;
}

export interface ChatState {
  socket: Socket;
  currentRoom: string;
  messages: MessageProps[];
}

export interface MessageProps {
  type: string;
  message: Message;
  admin?: boolean;
  location?: boolean;
}

export interface Message {
  sender: string;
  createdAt: number;
  text?: string;
  url?: string;
}

export interface ChatDispatchProps {
  room?: RoomsState;
  user?: UserProps;
  name?: string;
  socket?: Socket;
  messages?: Message[];
  setSocket: (socket: Socket) => void;
  setUser: (user: UserProps) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  changeRoom: (room) => void;
  setActiveRoom: (activeRoom) => void;
}
