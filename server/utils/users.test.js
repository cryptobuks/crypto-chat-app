const expect = require("expect");

const {Users} = require("./users");

describe("Users", () =>
    {

        var users;

        beforeEach(() =>
            {
                users = new Users();
                users.users = [
                    {
                        id: "1",
                        name: "bob",
                        room: "bobroom"
                    },
                    {
                        id: "2",
                        name: "alice",
                        room: "aliceroom"
                    },
                    {
                        id: "3",
                        name: "eve",
                        room: "bobroom"
                    }]
            });

        it("should add new user", () =>
            {
                var users = new Users();
                var user =
                    {
                        id: "123",
                        name: "bob",
                        room: "bobroom"
                    };
                var resUser = users.addUser(user.id, user.name, user.room);

                expect(users.users).toEqual([user]);
            });

        it("should remove a user", () =>
            {
                var user = users.removeUser("1");

                expect(user.id).toBe("1");
                expect(users.users.length).toBe(2);
            });

        it("should not remove a user", () =>
            {
                var user = users.removeUser("4");

                expect(user).toNotExist();
                expect(users.users.length).toBe(3);
            });

        it("should find user", () =>
            {
                var selUser = users.getUser("1");

                expect(selUser).toBe(users.users[0]);
            });

        it("should not find user", () =>
            {
                var selUser = users.getUser("4");

                expect(selUser).toNotExist();
            });

        it("should return names for bobroom", () =>
            {
                var userList = users.getUserList("bobroom");

                expect(userList).toEqual(["bob", "eve"]);
            });

        it("should return names for aliceroom", () =>
            {
                var userList = users.getUserList("aliceroom");

                expect(userList).toEqual(["alice"]);
            });
    });
