(function ($) {
    "use strict";

    var methods = {
        init: function (element, options, callback) {
            element.on("click", options.next, function (event) {
                event.preventDefault();
                var elementOptions = element.data("paginate-it");
                methods.load.call(this, element, elementOptions, callback);
            });
        },
        clear: function (element, options, callback) {
            options.page = $.fn.paginateIt.defaults.page - 1;

            // clear content of container
            $(options.container, element).html("");

            // check if callback is a function
            if (typeof callback === "function") {
                callback.call(this, element);
            }
        },
        replace: function (element, options, callback) {
            var container = $(options.container, element);
            // reset page number
            options.page = $.fn.paginateIt.defaults.page;

            $.ajax({
                url: options.baseUrl + "page/" + options.page + "/",
                dataType: "html"
            }).done(function (responseText) {

                    var fetchedContent = options.selector ?
                        $("<div>").append($.parseHTML(responseText)).find(options.selector) :
                        responseText;

                    // replace mode is hardcoded in replace plugin method
                    container.html(fetchedContent);

                    if (typeof(options.success) === "function") {
                        options.success.call(this, responseText);
                    }

                    // check if callback is a function
                    if (typeof callback === "function") {
                        callback.call(this, element);
                    }
                });

            // save changed page
            element.data("paginate-it", options);
        },
        load: function (element, options, callback) {
            // increment page number on each load call
            options.page++;
            $.ajax({
                url: options.baseUrl + "page/" + options.page + "/",
                dataType: "html"
            }).done(function (responseText) {

                    var container = $(options.container, element),
                        fetchedContent = options.selector ?
                            $("<div>").append($.parseHTML(responseText)).find(options.selector) :
                            responseText;

                    if (options.mode === "append") {
                        container.append(fetchedContent);
                    } else if (options.mode === "replace") {
                        container.html(fetchedContent);
                    } else {
                        // default is replace
                        container.html(fetchedContent);
                    }

                    if (typeof(options.success) === "function") {
                        options.success.call(this, responseText);
                    }

                    // check if callback is a function
                    if (typeof callback === "function") {
                        callback.call(this, element);
                    }
                });

            // save changed page
            element.data('paginate-it', options);
        }
    };

    $.fn.paginateIt = function (method, options, callback) {

        if (typeof(method) === "object") {
            callback = options;
            options = method;
        }

        if (typeof(options) === "function") {
            callback = options;
            options = {};
        }

        if (typeof(options) === "undefined") {
            options = {};
        }

        return this.each(function () {

            var self = $(this),
                elementOptions = self.data("paginate-it");
            if (!elementOptions) {
                elementOptions = $.fn.paginateIt.defaults;
            }

            elementOptions = $.extend({}, elementOptions, options);

            self.data("paginate-it", elementOptions);

            if (methods[method]) {
                return methods[ method ].call(self, self, elementOptions, callback);
            } else if (typeof method === "object" || !method) {
                // Default to "init"
                return methods.init.call(self, self, elementOptions, callback);
            } else {
                $.error("Method " + method + " does not exist on jQuery.paginateIt");
            }

            return this;
        });
    };

    $.fn.paginateIt.defaults = {
        page: 1, // current page, each load request increment it by 1, clear set it to 0
        baseUrl: null, // on every load request to that baseUrl plugin is appending: "page/" + page, warning: it must end with trailing slash
        mode: "append", // available modes are append (default) and replace
        selector: null, // used to extract items from fetched page
        container: null, // where to put fetched items
        next: null // css selector to listen for
    };

})(jQuery);
