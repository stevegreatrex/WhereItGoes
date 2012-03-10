module("RuleViewModel Tests");

test("Name Property Set", function () {
    var rule = { Name: "a name" };
    var vm = new App.ViewModels.RuleViewModel(rule);

    equal(vm.name(), rule.Name, "The name property should be set to the passed in value");
});

test("Rule Property Set", function () {
    var rule = { Name: "a name" };
    var vm = new App.ViewModels.RuleViewModel(rule);

    equal(vm.rule, rule, "The rule parameter should be exposed as an object property");
});

module("CategoryViewModel Tests");

test("Name Property Set", function () {
    var category = { Name: "a name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    equal(vm.name(), category.Name, "The name property should be set to the passed in value");
});

test("Rules Property Set", function () {
    var category = {
        Name: "name",
        Rules: [{ Name: "rule1" }, { Name: "rule2"}]
    };

    var vm = new App.ViewModels.CategoryViewModel(category);

    //check that the rules property is populated
    equal(vm.rules().length, 2, "Expected 2 rules");
    equal(vm.rules()[0].name(), "rule1", "Created rules should be RuleViewModels");
    equal(vm.rules()[1].name(), "rule2", "Created rules should be RuleViewModels");
});

test("Cancel", function () {
    var category = { Name: "old name", Rules: [{ Name: "old rule"}] };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set the name on the view model
    vm.name("new name");
    equal(vm.name(), "new name", "The name should be updated");
    equal(category.Name, "old name", "The category should not be updated yet");

    //add a new rule and remove the old one
    vm.rules.removeAll();
    vm.rules.push({ Name: "new rule" });

    //cancel
    vm.cancel();
    equal(vm.name(), "old name", "The name change should be reversed");
    equal(category.Name, "old name", "The category should not be updated");
    equal(vm.rules().length, 1, "Only one rule should be present");
    equal(vm.rules()[0].name(), "old rule", "The new rule should have been removed and the old one added");
});

test("Commit", function () {
    var category = {
        Name: "old name",
        Rules: [{ Name: "old rule name" }]
    };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set the name on the view model
    vm.name("new name");
    equal(vm.name(), "new name", "The name should be updated");
    equal(category.Name, "old name", "The category should not be updated yet");

    //update the rules
    vm.rules()[0].name("new rule name");
    vm.rules().push(new App.ViewModels.RuleViewModel({ Name: "new rule" }));

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

    //check that post has been called, that the category has been updated and that the complete
    //callback has not been called
    deepEqual(category, { Name: "new name", Rules: [{ Name: "new rule name" }, { Name: "new rule"}] }, "The source data should have been updated");
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

test("Add Rule", function () {
    var category = { Name: "name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    //set up a fake post to the addrule method
    var postUrl = null;
    var postData = null;
    var postCallback = null;
    jQuery.post = function (url, data, callback) {
        postUrl = url;
        postData = data;
        postCallback = callback;
    };

    //call the addRule method
    vm.addRule();

    //check that the post was called and that we are currently saving
    equal(postUrl, "addrule", "Should have posted to the addrule method");
    equal(postData, category, "The data posted back to the server should be the category");
    equal(vm.saving(), true, "Should be saving whilst adding a rule");

    //pass a new rule into the callback
    var newRule = { Name: "new rule" };
    postCallback(newRule);

    //check that a new rule was added to the view model
    equal(vm.rules().length, 1, "A new rule VM should have been added to the vm collection");
    equal(vm.rules()[0].rule, newRule, "The rule VM should have been based on the returned rule");
    equal(vm.saving(), false, "Should no longer be saving after post callback");
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