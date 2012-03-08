(function (App) {
    App.ViewModels.EditableViewModelBase = function () {
        this.editing = ko.observable(false);
        this.saving = ko.observable(false);
        this.error = ko.observable(false);
    };

    App.ViewModels.EditableViewModelBase.prototype._commit = function (complete) {
        complete(true);
    };

    App.ViewModels.EditableViewModelBase.prototype._cancel = function () {
        //do nothing by default
    };

    App.ViewModels.EditableViewModelBase.prototype.edit = function () {
        this.editing(true);
    };

    App.ViewModels.EditableViewModelBase.prototype.commit = function () {
        var _self = this;
        //set a few UI flags
        _self.editing(false);
        _self.saving(true);
        _self.error(false);

        this._commit(function (success) {
            _self.saving(false);

            if (!success)
                _self.error(true);
        });
    };

    App.ViewModels.EditableViewModelBase.prototype.cancel = function () {
        this._cancel();
        this.editing(false);
        this.saving(false);
        this.error(false);
    };
})(App);