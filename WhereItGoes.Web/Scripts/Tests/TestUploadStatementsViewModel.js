module("UploadStatementViewModel");

test("Properties Set", function () {
    //create a dummy jQuery object to pass into constructor
    var $uploadForm = {
        ajaxForm: function () { }
    };

    //create VM
    var vm = new App.ViewModels.UploadStatementsViewModel($uploadForm);

    //check the properties
    equal(vm.processing(), false, "Should not be initially processing");
    equal(vm.error(), false, "Should not be initially in error");
    equal(vm.results(), null, "Results should initially be null");
});

test("AJAX Form Submission", function () {
    //create a dummy jQuery object to pass into constructor
    var ajaxOptions = null;
    var $uploadForm = {
        ajaxForm: function (options) {
            ajaxOptions = options;
        }
    };

    //make sure we ignore any attempts to plot a graph
    jQuery.jqplot = function () { };

    //create VM
    var vm = new App.ViewModels.UploadStatementsViewModel($uploadForm);

    //check that the ajaxForm method was called with options
    notEqual(ajaxOptions, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.beforeSubmit, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.success, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.error, null, "Options should have been specified for the ajaxForms method");

    //check that before submit resets the error flag and sets processing to true
    vm.error(true);
    ajaxOptions.beforeSubmit();
    equal(vm.processing(), true, "Should now be processing");
    equal(vm.error(), false, "Error flag should be reset");
    equal(vm.results(), null, "Results should still be null");

    //check that the success callback sets processing to false
    vm.processing(true);
    ajaxOptions.success({ Transactions: [] });
    equal(vm.processing(), false, "Processing should be completed");
    notEqual(vm.results(), null, "Results should have been set");

    //check that error callback sets both processing and error
    vm.processing(true);
    ajaxOptions.error();
    equal(vm.processing(), false, "Processing should be completed");
    equal(vm.error(), true, "Error flag should be set");
    equal(vm.results(), null, "Results should have been reset be null");
});