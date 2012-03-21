(function (App) {
    App.ViewModels.UploadStatementsViewModel = function ($uploadForm) {
        var _self = this;
        _self.processing = ko.observable(false);
        _self.error = ko.observable(false);
        _self.results = ko.observable();
        $uploadForm = $uploadForm || $("#uploadform");

        $uploadForm.ajaxForm({
            beforeSubmit: function () {
                _self.processing(true);
                _self.error(false);
            },
            success: function (results) {
                _self.processing(false);
                var resultsVm = new App.ViewModels.AnalysisResultsViewModel("results", results);
                _self.results(resultsVm);
            },
            error: function () {
                _self.processing(false);
                _self.error(true);
                _self.results(null);
            }
        });

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.UploadStatementsViewModel());
});