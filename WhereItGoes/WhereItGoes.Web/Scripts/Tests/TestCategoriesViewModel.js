module("CategoryViewModel Tests");

test("Name Property Set", function () {
    var category = { Name: "a name" };
    var vm = new App.ViewModels.CategoryViewModel(category);

    equal(vm.name(), category.Name, "The name property should be set to the passed in value");
});

module("CategoriesViewModel Tests");

