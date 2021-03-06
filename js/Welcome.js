var Welcome = /** @class */ (function () {
    function Welcome() {
    }
    Welcome.init = function () {
        document.getElementById("welcome").onclick = Welcome.hide;
    };
    Welcome.isShown = function () {
        return !document.getElementById("welcome").classList.contains("menuHide");
    };
    Welcome.hide = function () {
        document.getElementById("welcome").classList.remove("menuShow");
        document.getElementById("welcome").classList.add("menuHide");
    };
    return Welcome;
}());
//# sourceMappingURL=Welcome.js.map