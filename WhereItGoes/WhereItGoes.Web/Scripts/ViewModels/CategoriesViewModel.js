(function (App) {
    App.ViewModels.CategoryViewModel = function (category) {
        App.ViewModels.EditableViewModelBase.apply(this);
        var _self = this;
        _self.name = ko.observable(category.Name);

        _self._commit = function (complete) {

            //update the original object
            category.Name = _self.name();

            //post back to the server
            $.post("savecategory", category, function (data) {
                complete(data);
            });
        };

        _self._cancel = function () {
            _self.name(category.Name);
        };

        return _self;
    };

    App.Utils.inheritsFrom(App.ViewModels.CategoryViewModel, App.ViewModels.EditableViewModelBase);
})(App);

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
                    _self.categories.push(new App.ViewModels.CategoryViewModel(data[i]));
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