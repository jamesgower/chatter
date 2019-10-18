const expect = require("expect");

const { Users } = require("../utils/users");

var users;

beforeEach(() => {
  users = new Users();
  users.users = [
    {
      id: "1",
      name: "Bill",
      room: "Node Course",
    },
    {
      id: "2",
      name: "Jill",
      room: "React Course",
    },
    {
      id: "3",
      name: "Ben",
      room: "Node Course",
    },
  ];
});

describe("Users", () => {
  it("should add a new user", () => {
    const users = new Users();
    const user = {
      id: "123",
      name: "James",
      room: "Test",
    };
    const response = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should remove a user", () => {
    const user = users.removeUser("1");
    expect(user.id).toBe("1");
    expect(users.users.length).toBe(2); // 3 originally, now should be 2
  });

  it("should not remove a user if it does not exist", () => {
    const user = users.removeUser("123");
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3); // should not change
  });

  it("should find user", () => {
    const user = users.getUser("2");
    expect(user.id).toBe("2");
  });

  it("should not find user if it does not exist", () => {
    const user = users.getUser("123");
    expect(user).toBeFalsy();
  });

  it("should return names for node course", () => {
    const userList = users.getUserList("Node Course");
    expect(userList).toEqual(["Bill", "Ben"]);
  });

  it("should return names for react course", () => {
    const userList = users.getUserList("React Course");
    expect(userList).toEqual(["Jill"]);
  });
});
