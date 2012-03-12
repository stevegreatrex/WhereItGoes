(function (App) {
    App.ViewModels.HomeViewModel = function () {
        var _self = {};
        _self.message = ko.observable("Find out where it goes...");

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.HomeViewModel());
});