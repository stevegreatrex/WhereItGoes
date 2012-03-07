(function (App) {
    App.ViewModels.CategoriesViewModel = function () {
        var _self = {};
        _self.categories = ko.observableArray();
        _self.loading = ko.observable(false);

        _self.loadCategories = function () {
            _self.loading(true);
            $.post("getcategories", function (data) {
                _self.categories.removeAll();
                for (var i = 0; i < data.length; i++) {
                    _self.categories.push(data[i]);
                }
                _self.loading(false);
            });
        };

        _self.loadCategories();

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.CategoriesViewModel());
});