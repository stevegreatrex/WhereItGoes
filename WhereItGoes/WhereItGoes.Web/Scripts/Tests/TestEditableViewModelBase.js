module("EditableViewModelBase Tests");

test("Adds UI Flags", function () {
    var vm = new App.ViewModels.EditableViewModelBase();
    equal(vm.editing(), false, "Should not be editing");
    equal(vm.saving(), false, "Should not be saving");
    equal(vm.error(), false, "Should not have an error");
    equal(vm.removed(), false, "Should not be deleted");
});

test("Edit", function () {
    var vm = new App.ViewModels.EditableViewModelBase();
    vm.edit();
    equal(vm.editing(), true, "Editing should now  be true");
});

test("Commit", function () {
    var vm = new App.ViewModels.EditableViewModelBase();

    //enter edit mode
    vm.edit();
    equal(vm.editing(), true, "Editing should now  be true");

    //replace the inner commit method
    var completeFunction = null;
    vm._commit = function (complete) {
        completeFunction = complete;
    };

    //start the commit
    vm.commit();

    //check that we are now saving and that the commit function has been called
    equal(vm.editing(), false, "Should not now be editing");
    equal(vm.saving(), true, "Should now be saving");
    notEqual(completeFunction, null, "The inner complete function should have been called");

    //now call the complete function with Success=true
    completeFunction(true);
    equal(vm.saving(), false, "Save should be completed");
    equal(vm.error(), false, "No error should be reported");
    equal(vm.editing(), false, "Should still not be editing");

    //commit again, but this time report an error
    vm.edit();
    vm.commit();
    completeFunction(false);
    equal(vm.saving(), false, "Save should be completed, even though there was an error");
    equal(vm.error(), true, "The error should be reported");
    equal(vm.editing(), false, "Should still not be editing");
});

test("Cancel", function () {
    var vm = new App.ViewModels.EditableViewModelBase();

    //enter edit mode
    vm.edit();
    equal(vm.editing(), true, "Editing should now  be true");

    //replace inner cancel
    var cancelled = false;
    vm._cancel = function () {
        cancelled = true;
    };

    //now cancel
    vm.cancel();

    //check that editing was reset and that the inner cancel was called
    equal(vm.editing(), false, "Editing should have been reset");
    equal(cancelled, true, "The inner cancel method should have been executed");
});

test("Remove", function () {
    var vm = new App.ViewModels.EditableViewModelBase();

    //replace the inner delete method
    var completeFunction = null;
    vm._remove = function (complete) {
        completeFunction = complete;
    };

    //start the delete
    vm.remove();

    //check that we are now saving and that the delete function has been called
    equal(vm.editing(), false, "Should not now be editing");
    equal(vm.saving(), true, "Should now be saving");
    notEqual(completeFunction, null, "The inner complete function should have been called");
    equal(vm.removed(), false, "Should not be marked as deleted yet");

    //now call the complete function with Success=true
    completeFunction(true);
    equal(vm.saving(), false, "Save should be completed");
    equal(vm.error(), false, "No error should be reported");
    equal(vm.editing(), false, "Should still not be editing");
    equal(vm.removed(), true, "Should now be marked as deleted");

    //commit again, but this time report an error
    vm.edit();
    vm.commit();
    completeFunction(false);
    equal(vm.saving(), false, "Save should be completed, even though there was an error");
    equal(vm.error(), true, "The error should be reported");
    equal(vm.editing(), false, "Should still not be editing");
    equal(vm.removed(), false, "Should not be marked as deleted");

});