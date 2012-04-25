(function (App) {
    App.ViewModels.TransactionViewModel = function (transaction) {
        var _self = {};
        _self.description = ko.observable(transaction.Description);
        _self.value = ko.observable(transaction.Value);
        _self.category = ko.observable(transaction.Category ? transaction.Category.Name : "Unknown");

        if (transaction.Date) {
            var exp = /-?\d+/;
            var sinceEpoch = exp.exec(transaction.Date)[0];
            _self.date = ko.observable(moment(parseFloat(sinceEpoch)));
        }

        return _self;
    };

    App.ViewModels.AnalysisResultsViewModel = function (resultsDivId, data) {
        var _self = {};
        _self.transactions = ko.observableArray();
        _self.totalExpenditure = ko.observable(data.TotalExpenditure);

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