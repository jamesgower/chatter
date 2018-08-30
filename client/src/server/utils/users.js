class Users {
    constructor() {
        this.users = []; // Instantiate an empty array to contain all the users which will be added to the room
    }

    /*
		The addUser function pushes the users' data into the array created in the constructor, and returns it.
	*/
    addUser(id, name, room) {
        this.users.push({
            id,
            name,
            room,
        });
        return this.users;
	}

	/*
		The removeUser function removes the selected user (by id) from the array, and returns the user which
		has been removed.
	*/
    removeUser(id) {
        var user = this.getUser(id);
        if (user) this.users = this.users.filter(user => user.id !== id);
        return user;
	}

	/*
		The getUser function returns the full user object from the users array by filtering the users' id to match
		the id in the users array.
	*/
    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
	}
	
	/* 
		The getUserList function filters all of the users which are in the chosen room (parameter), by matching the 
		user.room value to the room paramter, and returns it.
	*/
    getUserList(room) {
        const users = this.users.filter(user => user.room === room); //filters out all users which are not in the targeted room
        const namesArr = users.map(user => user.name); //return array of users names
        return namesArr;
	}
	
	/*
		The getRoomSize function filters all users' user.room value to check if it's a match with the room parameter 
		and returns the length of all the us to get the room size.
	*/
    getRoomSize(room) {
        return this.users.filter(user => user.room === room).length;
    }
}

module.exports = { Users };
