
define(["jquery", "elgg", "jquery.tag-it"], function ($, elgg){
	
	elgg.provide("elgg.tag_tools.autocomplete");
	
	elgg.tag_tools.autocomplete.split = function (val) {
		return val.split( /,/ );
	}

	elgg.tag_tools.autocomplete.extract_last = function (term) {
		return elgg.tag_tools.autocomplete.split( term ).pop().trim();
	}
	
	elgg.tag_tools.autocomplete.initialize = function (elem) {
		
		$(elem).parent().addClass("ui-front");
		
		$(elem)
		.data("tagToolsAutocompleteInitialized", true)
		// don't navigate away from the field on tab when selecting an item
		.bind("keydown", function(event) {
			if ((event.keyCode === $.ui.keyCode.TAB) && $(this).data("autocomplete").menu.active) {
				event.preventDefault();
			}
		})
		.tagit({
			caseSensitive: false,
			allowSpaces: true,
			autocomplete: {
				source: function(request, response) {
					elgg.getJSON("tags/autocomplete", {
						data: {
							q: elgg.tag_tools.autocomplete.extract_last(request.term),
						},
						success: response
					});
				},
				search: function() {
					// custom minLength
					var current = elgg.tag_tools.autocomplete.extract_last($(this).val());
					if (current.length > 1) {
						return true;
					}
					
					return false;
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				autoFocus: true,
				// turn off experimental live help - no i18n support and a little buggy
				messages: {
					noResults: '',
					results: function() {}
				},
				create: function (e) {
			        $(this).prev('.ui-helper-hidden-accessible').remove();
			    }
			}
		});
		/*.data("ui-autocomplete")._renderItem = function(ul, item) {
			
			return $("<li></li>")
				.data("item.autocomplete", item)
				.append("<a>" + item.value + "</a>")
				.appendTo( ul );
		};*/
	}
	
	return function() {
		$(".elgg-input-tags").each(function() {
			var data = $(this).data();
			
			if (!data.tagToolsAutocompleteInitialized) {
				elgg.tag_tools.autocomplete.initialize(this);
			}
		});
	}
});