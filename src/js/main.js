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
                item.value = item[item.type];
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

    function createForm(data){
    	var $category = $('#category');
    	for (category in data) {
    		$category.append('<option value="'+category+'">'+category+'</option>')
    	}
    }


    Handlebars.registerHelper('type-value', function(type, options) {
        var value = this[this.type],
            str = "strength-4";

        if(value < 20){
        	str = "strength-3";
        }

        if (value < 10) {
        	str = "strength-2";
        }

        if (value < 5) {
        	str = "strength-1";
        }

        return str;

    });

    function createSearch(collection){
    	var query = collection,
			index = lunr(function () {
				this.field('name', {boost: 10});
				this.field('type');
				this.field('value');
				this.field('category');
				this.ref('id');
			});

		for (var i = 0; i < query.length; i++) {
			index.add(query[i]);
		};
		

		$('#search').on('keyup', function (e) {
			var val = getValue.call(this);
			search(val, "text");
		});

		$('input[type="radio"], #category').on('change', function () {
			var val = getValue.call(this);
			search(val, this.name);
		});

		/*
		* Get values
		*/

		function getValue(){
			var $this = $(this),
				val = $this.val().trim();
			return val;	
		}


		/*
		* Search
		*/
		var search = function(){
			var search = [];
			
			function add(val, input){
				if(search[input] === undefined) search[input] = [];
				search[input] = val;
			}

			function searchString(){
				var string = "";
				for ( key in search ) {
					if(search[key].length){
				  		string += search[key] + " ";
					}
				}
				return string;
			}

			return function(val, input){
				add(val, input);
				sort( index.search(searchString()), searchString() );
			}
		}();

		/*
		* Sort
		*/

		var sort = function(){
			var $collection = $('.item'),
				collection = [];

			$collection.each(function(i,el){
				var $el = $collection.eq(i),
					key = $el.data('id');
				collection[key] = $el;				
			})

			return function(el, string){
				if(string === "") return $collection.show();
				
				$collection.hide();
				for (var i = 0; i < el.length; i++) {
					collection[el[i].ref].show();
				};
				
			}
		}();
    }

    function init(data){
		var collection = parseData(data);

    	createForm(data);
        templateItems(collection);
        createSearch(collection);
    }


    $(document).ready(function() {
        $.getJSON('syrebasetable.js', function(data) {
            init(data)
        })
    });
}(jQuery))



// (function($,lunr){
// 	$(document).ready(function(){
// 		var query = window.lunrQuery,
// 			index = lunr(function () {
// 				this.field('name', {boost: 10});
// 				this.field('type');
// 				this.field('value');
// 				this.ref('id');
// 			});

// 		/*
// 		* Add to index
// 		*/

// 		for (var i = 0; i < query.length; i++) {
// 			index.add(query[i]);
// 		};

// 		/*
// 		* Listeners
// 		*/

// 		$('#search').on('keyup', function (e) {
// 			var val = getValue.call(this);
// 			search(val, "text");
// 		});

// 		$('#type, #category').on('change', function () {
// 			var val = getValue.call(this);
// 			search(val, this.name);
// 		});

// 		/*
// 		* Get values
// 		*/

// 		function getValue(){
// 			var $this = $(this),
// 				val = $this.val().trim();
// 			return val;	
// 		}


// 		/*
// 		* Search
// 		*/
// 		var search = function(){
// 			var search = [];
			
// 			function add(val, input){
// 				if(search[input] === undefined) search[input] = [];
// 				search[input] = val;
// 			}

// 			function searchString(){
// 				var string = "";
// 				for ( key in search ) {
// 					if(search[key].length){
// 				  		string += search[key] + " ";
// 					}
// 				}
// 				return string;
// 			}

// 			return function(val, input){
// 				add(val, input);
// 				console.log(searchString());
// 				sort( index.search( searchString()), searchString() );
// 			}
// 		}();

// 		/*
// 		* Sort
// 		*/

// 		var sort = function(){
// 			var $collection = $('.idea-catalogue-image'),
// 				collection = [];

// 			$collection.each(function(i,el){
// 				var $el = $collection.eq(i),
// 					key = $el.data('id');
// 				collection[key] = $el;				
// 			})

// 			return function(el, string){
// 				if(string === "") return $collection.show();
				
// 				$collection.hide();
// 				for (var i = 0; i < el.length; i++) {
// 					collection[el[i].ref].show();
// 				};
				
// 			}
// 		}()

// 	});
// }(jQuery, lunr)) 
