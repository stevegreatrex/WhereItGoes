module("HomeViewModel Tests");

test("Properties set", function () {
    //set up a fake post method and vm constructor
    var fakeVM = {};
    App.ViewModels.AnalysisResultsViewModel = function () { return fakeVM; };
    var data = {
        CategoryCounts: [],
        Transactions: []
    };
    App.Utils.postJson = function (a, b, callback) {
        callback(data);
    };

    //create vm
    var vm = new App.ViewModels.HomeViewModel();

    //check properties
    var dateDiff = vm.toDate() - vm.fromDate();
    equal(dateDiff, 365 * 24 * 60 * 60 * 1000, "From Date should have been set to a year ago");
    equal(vm.loading(), false, "Should not be loading");
    equal(vm.results(), fakeVM, "Results should be the fake VM");
});

test("RefreshResults", function () {
    //set up a fake post method
    var postUrl = null;
    var postFilter = null;
    var postCallback = null;
    App.Utils.postJson = function (url, filter, callback) {
        postUrl = url;
        postFilter = filter;
        postCallback = callback;
    };

    //create vm, which calls the refresh
    var vm = new App.ViewModels.HomeViewModel();

    //check that we are still loading and that the post was called
    equal(postUrl, "/home/analyse", "Should have posted to the analyse method");
    equal(vm.loading(), true, "Should be loading as post callback has not been called");
    var expectedFilter = {
        from: vm.fromDate(),
        to: vm.toDate()
    };
    deepEqual(postFilter, expectedFilter, "Filter properties should have been taken from vm properties");

    //create a fake AnalysisVM constructor
    var vmDivId = null;
    var vmResults = null;
    var fakeVM = {};
    App.ViewModels.AnalysisResultsViewModel = function (divId, results) {
        vmDivId = divId;
        vmResults = results;
        return fakeVM;
    };

    //call the callback, check that the vm was created and that loading was done
    var results = {};
    postCallback(results);
    equal(vm.loading(), false, "Should no longer be loading");
    equal(vmDivId, "results", "Should have passed the ID 'results' to the VM constructor");
    equal(vmResults, results, "Should have passed the callback results to the VM constructor");
    equal(vm.results(), fakeVM, "The results property should have been set");
});