(function($) {
    function parseData(data) {
        var collection = [],
            count = 0;

        for (category in data) {
            var catItem = data[category];
            for (var i = 0; i < catItem.length; i++) {
                var item = catItem[i];
                item.id = count;
                item.category = category;
                item.type = getPhType(item);
                collection.push(item);
                count += 1;
            };
        }

        return collection;
    }

    function getPhType(item) {
        if (item.syre > item.base) return "syre";
        if (item.syre < item.base) return "base";
        if (item.syre === item.base) return "neutral";
    }

    function templateItems(collection) {
        var collection = {
            items: collection
        };
        var source = $("#item-template").html(),
            template = Handlebars.compile(source),
            html = template(collection);

        $('.container').html(html);
    }

    Handlebars.registerHelper('type-value', function(type, options) {
        if (this.type === "syre") {
            return this.syre;
        } else {
            return this.base;
        }
    });

    Handlebars.registerHelper('type-value-diff-color', function(type, options) {
        var value = this[this.type],
            str = "strength-4";

        if(value < 5){
        	str = "strength-1";
        } if (value < 10) {
        	str = "strength-2";
        } else if (value < 20) {
        	str = "strength-3";
        }

        return str;

    });

    $(document).ready(function() {
        var collection;
        $.getJSON('syrebasetable.js', function(data) {
            collection = parseData(data);
            templateItems(collection);
        })
    });
}(jQuery))