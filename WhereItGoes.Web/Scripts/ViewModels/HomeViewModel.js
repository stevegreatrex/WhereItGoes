(function (App) {
    App.ViewModels.HomeViewModel = function () {
        var _self = {};
        _self.message = ko.observable("Find out where it goes...");

        var data = { from: new Date(1, 1, 2001), to: new Date() };
        App.Utils.postJson("home/analyse", data, function (results) {
            //alert(JSON.stringify(results));
        });

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.HomeViewModel());
});