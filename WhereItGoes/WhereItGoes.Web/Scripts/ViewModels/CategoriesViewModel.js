(function (App) {
    App.ViewModels.RuleViewModel = function (rule) {
        App.ViewModels.EditableViewModelBase.apply(this);
        var _self = this;
        _self.name = ko.observable(rule.Name);
        _self.rule = rule;

        _self.updateRule = function () {
            _self.rule.Name = _self.name();
        };

        return _self;
    };

    App.Utils.inheritsFrom(App.ViewModels.RuleViewModel, App.ViewModels.EditableViewModelBase);
})(App);

(function (App) {
    App.ViewModels.CategoryViewModel = function (category) {
        App.ViewModels.EditableViewModelBase.apply(this);
        var _self = this;
        _self.name = ko.observable(category.Name);
        _self.rules = ko.observableArray();

        //add rule view  models for any existing rules on the category
        _self._setRuleVMsFromRule = function () {
            _self.rules.removeAll();
            if (category.Rules) {
                for (var i = 0; i < category.Rules.length; i++) {
                    _self.rules.push(new App.ViewModels.RuleViewModel(category.Rules[i]));
                }
            }
        };

        //commit any changes to the server
        _self._commit = function (complete) {

            //update the original object
            category.Name = _self.name();
            category.Rules = [];
            for (var i = 0; i < _self.rules().length; i++) {
                var ruleVM = _self.rules()[i];
                ruleVM.updateRule();
                category.Rules.push(ruleVM.rule);
            }

            //post back to the server
            $.post("savecategory", category, function (data) {
                complete(data);
            });
        };

        //undo any changes
        _self._cancel = function () {
            _self.name(category.Name);
            _self._setRuleVMsFromRule();
        };

        _self._remove = function(complete) {
            //post back to the server
            $.post("removecategory", category, function (data) {
                complete(data);
            });
        };

        _self.addRule = function() {
            _self.saving(true);

            $.post("addrule", category, function(rule) {
                _self.rules.push(new App.ViewModels.RuleViewModel(rule));
                _self.saving(false);
            });
        };

        _self._setRuleVMsFromRule();
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

        _self.addCategory = function () {
            _self.loading(true);
            $.post("addcategory", function (data) {
                _self.categories.push(new App.ViewModels.CategoryViewModel(data));
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