(function (App) {
    App.ViewModels.TransactionViewModel = function (transaction) {
        var _self = {};
        _self.description = ko.observable(transaction.Description);
        _self.value = ko.observable(transaction.Value);

        return _self;
    };

    App.ViewModels.AnalysisResultsViewModel = function (resultsDivId, data) {
        var _self = {};
        _self.transactions = ko.observableArray();

        //populate transactions
        for (var i = 0; i < data.Transactions.length; i++) {
            _self.transactions.push(new App.ViewModels.TransactionViewModel(data.Transactions[i]));
        }

        //plot graph
        $.jqplot(resultsDivId, [data.Expenditure], {
            seriesDefaults: {
                renderer: $.jqplot.PieRenderer,
                rendererOptions: {
                    showDataLabels: true
                }
            },
            legend: {
                show: true,
                location: "e"
            }
        });

        return _self;
    };
})(App);