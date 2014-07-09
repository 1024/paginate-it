(function ($) {
    "use strict";

    $.fn.paginateIt = function (options, callback) {

        if (typeof(options) === "function") {
            callback = options;
            options = {};
        }

        var globalSettings = $.extend({}, $.fn.paginateIt.defaults, options);

        return this.each(function () {

            var elementSettings = $.extend({}, globalSettings, $(this).data()),
                self;

            self = $(this);

            self.on("click", elementSettings.next, function (event) {
                event.preventDefault();
                load(self, elementSettings, callback);
            });

            return this;
        });
    };

    // private function that executes ajax loading of next page
    function load(self, elementSettings, callback) {
        elementSettings.page++;
        $.ajax({
            url: elementSettings.baseUrl + "page/" + elementSettings.page + "/",
            dataType: "html"
        }).done(function (responseText) {

                var container = $(elementSettings.container, self),
                    fetchedContent = elementSettings.selector ?
                        $("<div>").append($.parseHTML(responseText)).find(elementSettings.selector) :
                        responseText;

                if (elementSettings.mode === "append") {
                    container.append(fetchedContent);
                } else if (elementSettings.mode === "replace") {
                    container.html(fetchedContent);
                } else {
                    // default is replace
                    container.html(fetchedContent);
                }

                // check if callback is a function
                if (typeof callback === "function") {
                    callback.call(this, self);
                }
            });
    }

    $.fn.paginateIt.defaults = {
        baseUrl: null,
        mode: "append",
        container: null,
        selector: null,
        next: null
    };

})(jQuery);
