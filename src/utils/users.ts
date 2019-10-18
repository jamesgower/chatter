import { UserProps } from "./interfaces/user.i";

export class Users {
  public users: UserProps[];
  public constructor() {
    this.users = [];
  }

  /*
		The addUser function pushes the users' data into the array created in the constructor, and returns it.
	*/
  public addUser(id: string, name: string, activeRoom: string): UserProps[] {
    this.users.push({
      id,
      name,
      activeRoom,
    });
    return this.users;
  }

  /*
		The removeUser function removes the selected user (by id) from the array, and returns the user which
		has been removed.
	*/
  public removeUser(id: string): UserProps {
    const user = this.getUser(id);
    if (user) this.users = this.users.filter((user): boolean => user.id !== id);
    return user;
  }

  /*
		The getUser function returns the full user object from the users array by filtering the users' id to match
		the id in the users array.
	*/
  public getUser(id: string): UserProps {
    return this.users.filter((user): boolean => user.id === id)[0];
  }

  /* 
		The getUserList function filters all of the users which are in the chosen room (parameter), by matching the 
		user.room value to the room paramter, and returns it.
	*/
  public getUserList(room: string): string[] {
    const users = this.users.filter((user): boolean => user.activeRoom === room); // filters out all users which are not in the targeted room
    const namesArr = users.map((user): string => user.name); // return array of users names
    return namesArr;
  }
}
