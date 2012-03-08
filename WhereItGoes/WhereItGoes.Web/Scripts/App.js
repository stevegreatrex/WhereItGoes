App = {};
App.ViewModels = {};

App.Utils = {};
App.Utils.inheritsFrom = function (Child, Parent) {
    var F = function () { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;
};