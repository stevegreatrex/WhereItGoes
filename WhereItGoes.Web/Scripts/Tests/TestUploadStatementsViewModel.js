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
});

test("AJAX Form Submission", function () {
    //create a dummy jQuery object to pass into constructor
    var ajaxOptions = null;
    var $uploadForm = {
        ajaxForm: function (options) {
            ajaxOptions = options;
        }
    };

    //create VM
    var vm = new App.ViewModels.UploadStatementsViewModel($uploadForm);

    //check check that the ajaxForm method was called with options
    notEqual(ajaxOptions, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.beforeSubmit, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.success, null, "Options should have been specified for the ajaxForms method");
    notEqual(ajaxOptions.error, null, "Options should have been specified for the ajaxForms method");

    //check that before submit resets the error flag and sets processing to true
    vm.error(true);
    ajaxOptions.beforeSubmit();
    equal(vm.processing(), true, "Should now be processing");
    equal(vm.error(), false, "Error flag should be reset");

    //check that the success callback sets processing to false
    vm.processing(true);
    ajaxOptions.success();
    equal(vm.processing(), false, "Processing should be completed");

    //check that error callback sets both processing and error
    vm.processing(true);
    ajaxOptions.error();
    equal(vm.processing(), false, "Processing should be completed");
    equal(vm.error(), true, "Error flag should be set");
});