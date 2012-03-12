(function (App) {
    App.ViewModels.HomeViewModel = function () {
        var _self = {};
        _self.toDate = ko.observable(new Date());
        _self.fromDate = ko.observable(new Date(_self.toDate() - 1000 * 60 * 60 * 24 * 365)); //1 year ago
        _self.loading = ko.observable(false);
        _self.results = ko.observable();

        _self.refreshResults = function () {
            _self.loading(true);
            var filter = { from: _self.fromDate(), to: _self.toDate() };

            App.Utils.postJson("/home/analyse", filter, function (results) {
                _self.loading(false);
                var resultsVm = new App.ViewModels.AnalysisResultsViewModel("results", results);
                _self.results(resultsVm);
            });
        };

        _self.refreshResults();

        return _self;
    };
})(App);

$(function () {
    ko.applyBindings(new App.ViewModels.HomeViewModel());
});