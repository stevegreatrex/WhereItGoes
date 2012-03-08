module("CategoryViewModel Tests");

test("Name Property Set", function () {
    var category = { Name: "a name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    equal(vm.name(), category.Name, "The name property should be set to the passed in value");
});

test("Cancel", function () {
    var category = { Name: "old name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set the name on the view model
    vm.name("new name");
    equal(vm.name(), "new name", "The name should be updated");
    equal(category.Name, "old name", "The category should not be updated yet");

    //cancel
    vm.cancel();
    equal(vm.name(), "old name", "The name change should be reversed");
    equal(category.Name, "old name", "The category should not be updated");
});

test("Commit", function () {
    var category = { Name: "old name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set the name on the view model
    vm.name("new name");
    equal(vm.name(), "new name", "The name should be updated");
    equal(category.Name, "old name", "The category should not be updated yet");

    //set up a fake completion callback that records the passed result
    var completeData = null;
    var completeCallback = function (data) {
        completeData = data;
    };

    //set up a fake jQuery.post
    var postUrl = null;
    var postData = null;
    var postCallback = null;
    jQuery.post = function (url, data, callback) {
        postUrl = url;
        postData = data;
        postCallback = callback;
    };

    //call the commit with the fake callback
    vm._commit(completeCallback);

    //check that post has been called, that the name has been updated and that the complete
    //callback has not been called
    equal(category.Name, "new name", "The name on the source data should be updated");
    equal(postUrl, "savecategory", "Should have posted to the savecategory method");
    equal(postData, category, "Should have passed the source data as post data");
    equal(null, completeData, "The complete callback should not be called until post completes");

    //call the post success callback with 'true' and check that true was passed to complete callback
    postCallback(true);
    equal(completeData, true, "The post data result should be passed back to complete callback");

    //call the post success callback with 'false' and check that false was passed to complete callback
    postCallback(false);
    equal(completeData, false, "The post data result should be passed back to complete callback");
});

test("Remove", function () {
    var category = { Name: "name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set up a fake completion callback that records the passed result
    var completeData = null;
    var completeCallback = function (data) {
        completeData = data;
    };

    //set up a fake jQuery.post
    var postUrl = null;
    var postData = null;
    var postCallback = null;
    jQuery.post = function (url, data, callback) {
        postUrl = url;
        postData = data;
        postCallback = callback;
    };

    //call the remove with the fake callback
    vm._remove(completeCallback);

    //check that post has been called, that the name has been updated and that the complete
    //callback has not been called
    equal(postUrl, "removecategory", "Should have posted to the removecategory method");
    equal(postData, category, "Should have passed the source data as post data");
    equal(null, completeData, "The complete callback should not be called until post completes");

    //call the post success callback with 'true' and check that true was passed to complete callback
    postCallback(true);
    equal(completeData, true, "The post data result should be passed back to complete callback");

    //call the post success callback with 'false' and check that false was passed to complete callback
    postCallback(false);
    equal(completeData, false, "The post data result should be passed back to complete callback");
});

module("CategoriesViewModel Tests");

test("Properties Setup", function () {
    //set up a fake $.post to prevent errors
    jQuery.post = function (url, callback) {
        callback([]);
    };

    var vm = new App.ViewModels.CategoriesViewModel();
    equal(vm.categories().length, 0, "categories property should be initially empty");
    equal(vm.loading(), false, "loading should be false");
});

test("Load Categories", function () {
    //set up a fake jQuery.post
    var postUrl = null;
    var postCallback = null;
    jQuery.post = function (url, callback) {
        postUrl = url;
        postCallback = callback;
    };

    //construct VM, which kicks off loading
    var vm = new App.ViewModels.CategoriesViewModel();

    //check that we are loading and that post has been called
    equal(vm.loading(), true, "Should now be loading");
    equal(postUrl, "getcategories", "Post should have been made to getcategories");

    //now make the success callback and check that the data is updated
    var result = [{ Name: "one" }, { Name: "two"}];
    postCallback(result);
    equal(vm.loading(), false, "Should no longer be loading after post completion");
    equal(vm.categories().length, 2, "Expected 2 results");
    equal(vm.categories()[0].name(), "one", "Expected result to be a CategoryViewModel");
    equal(vm.categories()[1].name(), "two", "Expected result to be a CategoryViewModel");

    //finally, re-refresh to check that old results are replaced
    var newResult = [{ Name: "three"}];
    postCallback(newResult);
    equal(vm.categories().length, 1, "Expected only 1 result now");
    equal(vm.categories()[0].name(), "three", "Expected result to be a CategoryViewModel");
});

test("Add Category", function () {
    //set up a fake $.post to prevent errors during construction
    jQuery.post = function (url, callback) {
        callback([]);
    };

    //create vm
    var vm = new App.ViewModels.CategoriesViewModel();

    //set up a fake jQuery.post to handle Add
    var postUrl = null;
    var postCallback = null;
    jQuery.post = function (url, callback) {
        postUrl = url;
        postCallback = callback;
    };

    //call addCategory
    vm.addCategory();

    //check that loading is true and that the post was called
    equal(vm.loading(), true, "Should be loading");
    equal(postUrl, "addcategory", "Should have made POST to addcategory");

    //call the complete callback
    var category = { Name: "new category" };
    postCallback(category);

    //check that a new view model was added to categories
    equal(vm.categories().length, 1, "Expected the new result");
    equal(vm.categories()[0].name(), "new category", "Expected result to be a CategoryViewModel");
});