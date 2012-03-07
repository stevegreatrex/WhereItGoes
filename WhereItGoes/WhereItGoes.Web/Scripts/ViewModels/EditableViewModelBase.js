(function (App) {
    App.ViewModels.EditableViewModelBase = function () {
        this.editing = ko.observable(false);
        this.saving = ko.observable(false);
        this.error = ko.observable(false);
    };

    App.ViewModels.EditableViewModelBase.prototype.edit = function () {
        this.editing(true);
    };

    App.ViewModels.EditableViewModelBase.prototype.innerCommit = function (complete) {
        complete(true);
    };

    App.ViewModels.EditableViewModelBase.prototype.commit = function () {
        var _self = this;
        //set a few UI flags
        _self.editing(false);
        _self.saving(true);
        _self.error(false);

        this.innerCommit(function (success) {
            _self.saving(false);

            if (!success)
                _self.error(true);
        });
    };
})(App);