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

//utility method to handle posting JSON to an MVC controller
App.Utils.postJson = function (url, data, success, error) {
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: success,
        error: error
    });
};