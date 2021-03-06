var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    /**
     * initialisation: creation of myself :)
     */
    UserManager.init = function () {
        UserManager.me = new User(true);
        UserManager.users['root'] = UserManager.me;
        UserManager.me.setUserID('root');
    };
    /**
     * @returns true if the userID of the current user is the minimum of all participants
     */
    UserManager.isSmallestUserID = function () {
        var minkey = "zzzzzzzzzzzzzzzz";
        for (var key in UserManager.users) {
            if (key < minkey)
                minkey = key;
        }
        return (UserManager.me.userID == minkey);
    };
    /**
     *
     * @param {*} userid
     * @description userid leaves
     */
    UserManager.leave = function (userid) {
        UserManager.users[userid].destroy();
        delete UserManager.users[userid];
        UserManager.updateUsers();
    };
    /**
     *
     * @param {*} userid
     * @description add a new user of ID userid
     */
    UserManager.add = function (userid) {
        UserManager.users[userid] = new User(false);
        UserManager.updateUsers();
    };
    /**
     *
     * @param {*} userid
     * @description renaUserManager.me the current user (UserManager.me) as userid
     */
    UserManager.setMyUserID = function (userid) {
        for (var key in UserManager.users) {
            if (UserManager.users[key] == UserManager.me)
                delete UserManager.users[key];
        }
        UserManager.users[userid] = UserManager.me;
        UserManager.me.setUserID(userid);
        UserManager.updateUsers();
    };
    UserManager.getUserImage = function (userid) {
        var img = new Image();
        var i = parseInt(userid.substr(1));
        img.src = "img/users/" + UserManager.usersImageFileNames[i % UserManager.usersImageFileNames.length];
        img.classList.add("userImage");
        return img;
    };
    UserManager.userIdToDom = function (userID) {
        var userDOM = UserManager.getUserImage(userID);
        userDOM.classList.add("user");
        userDOM.title = "user " + userID;
        return userDOM;
    };
    /**
     * @description update the GUI
     */
    UserManager.updateUsers = function () {
        document.getElementById("users").innerHTML = "";
        var i = 0;
        for (var key in UserManager.users) {
            var el = UserManager.userIdToDom(key);
            if (key == UserManager.me.userID)
                el.classList.add("me");
            document.getElementById("users").appendChild(el);
            i++;
        }
    };
    UserManager.me = undefined;
    UserManager.users = {};
    UserManager.usersImageFileNames = ['1F9D1-200D-1F384.svg', '1F9D9.svg', '1F9DA-200D-2640-FE0F.svg', '1F9DD.svg'];
    return UserManager;
}());
//# sourceMappingURL=UserManager.js.map