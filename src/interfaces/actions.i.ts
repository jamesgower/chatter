import { Socket } from "socket.io";
import { UserProps } from "../utils/interfaces/user.i";
import { Message } from "./components.i";

export const CHANGE_ROOM = "CHANGE_ROOM";
export const SET_SOCKET = "SET_SOCKET";
export const SET_USER = "SET_USER";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const CLEAR_MESSAGES = "CLEAR_MESSAGES";
export const USER_LEFT_ROOM = "USER_LEFT_ROOM";
export const SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM";
export const ADD_ROOM = "ADD_ROOM";
export const SET_ACTIVE_USERS = "SET_ACTIVE_USERS";

export interface SetActiveRoomAction {
  type: typeof SET_ACTIVE_ROOM;
  activeRoom: string;
}

export interface ChangeRoomAction {
  type: typeof CHANGE_ROOM;
  newRoom: string;
}

export interface SetSocketAction {
  type: typeof SET_SOCKET;
  socket: Socket;
}

export interface SetUserAction {
  type: typeof SET_USER;
  user: UserProps;
}

export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  message: Message;
}

export interface ClearMessagesAction {
  type: typeof CLEAR_MESSAGES;
}

export interface UserLeftRoomAction {
  type: typeof USER_LEFT_ROOM;
}

export interface AddRoomAction {
  type: typeof ADD_ROOM;
  name: string;
}

export interface SetActiveUsersAction {
  type: typeof SET_ACTIVE_USERS;
  users: number;
}
