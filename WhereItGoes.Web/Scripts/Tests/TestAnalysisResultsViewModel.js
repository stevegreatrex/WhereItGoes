module("AnalysisResultsViewModel Tests");

test("Plots Results", function () {
    //set up a fake jqplot handler
    var plotResultsId = null;
    var plotData = null;
    var plotOptions = null;
    jQuery.jqplot = function (resultsDivId, data, options) {
        plotResultsId = resultsDivId;
        plotData = data;
        plotOptions = options;
    };

    //call the function
    var data = {
        Transactions: [],
        CategoryCounts: [["Category", 1], ["Category2", 2]]
    };
    var vm = new App.ViewModels.AnalysisResultsViewModel("resultsDiv", data);

    //check that jqplot was called
    equal(plotResultsId, "resultsDiv", "The results div should have been passed to jqplot");
    deepEqual(plotData, [data.CategoryCounts], "The category counts should have been passed to jqplot");

    //check the options
    var expectedOptions = {
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
    };
    deepEqual(expectedOptions, plotOptions, "The options object should have been set up");
});