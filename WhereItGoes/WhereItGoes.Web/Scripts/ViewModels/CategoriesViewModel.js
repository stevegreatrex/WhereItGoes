(function (App) {
    App.ViewModels.CategoryViewModel = function (category) {
        var _self = {};
        _self.name = ko.observable(category.Name);
        _self.editing = ko.observable(false);
        _self.saving = ko.observable(false);
        _self.error = ko.observable(false);

        _self.edit = function () {
            _self.editing(true);
        };

        _self.commit = function () {
            //set a few UI flags
            _self.editing(false);
            _self.saving(true);
            _self.error(false);

            //update the original object
            category.Name = _self.name();

            //post back to the server
            $.post("savecategory", category, function (data) {
                //update the UI flags
                _self.saving(false);

                //report an error if necessary
                if (!data)
                    _self.error(true);
              
            });
        };
        return _self;
    };
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