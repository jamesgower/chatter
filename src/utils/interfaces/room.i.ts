import { UserProps } from "./user.i";

export interface RoomProps {
  id: string;
  room: string;
  activeUsers: UserProps[];
}
