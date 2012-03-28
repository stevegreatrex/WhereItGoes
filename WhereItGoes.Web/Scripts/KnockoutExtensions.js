ko.bindingHandlers.tablesorter = {
    init: function (element, valueAccessor) {
        $(element).parent("table").tablesorter();
    },
    update: function (element, valueAccessor) {
        $(element).parent("table").trigger("update");
    }
};