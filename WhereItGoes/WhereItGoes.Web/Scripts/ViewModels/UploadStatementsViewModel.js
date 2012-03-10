﻿(function (App) {
    App.ViewModels.UploadStatementsViewModel = function ($uploadForm) {
        var _self = this;
        _self.processing = ko.observable(false);
        _self.error = ko.observable(false);
        $uploadForm = $uploadForm || $("#uploadform");

        $uploadForm.ajaxForm({
            beforeSubmit: function () {
                _self.processing(true);
                _self.error(false);
            },
            success: function (data) {
                _self.processing(false);
            },
            error: function () {
                _self.processing(false);
                _self.error(true);
            }
        });

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.UploadStatementsViewModel());
});