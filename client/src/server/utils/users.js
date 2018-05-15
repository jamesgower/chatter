class Users {
	constructor() {
		this.users = [];
	}
	addUser(id, name, room) {
		this.users.push({
			id,
			name,
			room,
		});
		return this.users;
	}
	removeUser(id) {
		var user = this.getUser(id);
		if (user) this.users = this.users.filter(user => user.id !== id);
		return user;
	}
	getUser(id) {
		return this.users.filter(user => user.id === id)[0];
	}
	getUserList(room) {
		const users = this.users.filter(user => user.room === room); //filters out all users which are not in the targeted room
		const namesArr = users.map(user => user.name); //return array of users names
		return namesArr;
	}
}

module.exports = { Users };
