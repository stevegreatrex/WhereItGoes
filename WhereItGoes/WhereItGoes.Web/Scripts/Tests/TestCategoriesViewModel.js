module("CategoriesViewModel Tests");

test("Adds UI Flags", function () {
    var vm = new App.ViewModels.EditableViewModelBase();
    equal(vm.editing(), false, "Should not be editing");
    equal(vm.saving(), false, "Should not be saving");
    equal(vm.error(), false, "Should not have an error");
});