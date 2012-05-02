/*
 * QueryBerg
 * 
 * Version 0.1
 * 
 * http://github.com/turutosiya/queryberg
 *
 * A jQuery plugin for searching Project Gutenberg (http://www.gutenberg.org/). 
 *
 * Copyright (c) 2011 Toshiya TSURU <turutosiya@gmail.com>
 * 
 * Dual licensed under the MIT and GPL licenses.
*/
(function($) {

	// DEFINE YAHOO API URL
	var _URL_YQL_V1           = 'http://query.yahooapis.com/v1/public/yql'; 
	var _URL_YQL              = _URL_YQL_V1;
	
	// DEFINE GUTENBERG URLs
	var _URL_GUTENBERG        = 'http://www.gutenberg.org';
	var _URL_GUTENBERG_SEARCH = _URL_GUTENBERG + '/ebooks/search.opds/';
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * functions used internally.
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */  
	/**
	 * cross domain request proxy (uses Yahoo API)
	 */
	function _xdr(url, callback) {
		$.getJSON(
			_URL_YQL + '?callback=?',
			{
				q: 'select * from xml where url="' + url + '"',
				format: 'xml'
			},
			function(data) {
				if (data.results[0]) {
					if ($.isFunction(callback)) {
						callback(data.results[0]);
					}
				}
			});
	}
	
	/**
	 * parse XML
	 */
	function _xml(_string) {
		var browserName = navigator.appName;
		var xml;
		if (jQuery.browser.msie) {
			xml = new ActiveXObject('Microsoft.XMLDOM');
			xml.async = false;
			xml.loadXML(_string);
		} else {
			xml = (new DOMParser()).parseFromString(_string, 'text/xml');
		}
		return xml;
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * jQuery extending
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */  
	var exts = {
		/**
		 * queryberg
		 */
		queryberg : function(query, callback) {
			var url = _URL_GUTENBERG_SEARCH + '?query=' + encodeURIComponent(query);
			_xdr(url, function(xml) {
				var feed = new JFeed(_xml(xml));
				// remove first 4 items (they're not an item in fact.)
				feed.items.splice(0,4);
				// 
				$.each(feed.items, function(index, item) { 
					item.link = _URL_GUTENBERG + item.link
					item.href = item.link.substring(0, item.link.length - 5);
				});
	            if ($.isFunction(callback)) {
	            	callback(feed);
	            }
			});
			// return object
			return this;
		}
	};
	
	// define syntax sugar
	if(typeof($.qb) === "undefined") {
		exts.qb = exts.queryberg;
	}
		
	// extends jQuery
	$.extend(exts);

})(jQuery);