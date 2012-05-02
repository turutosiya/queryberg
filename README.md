queryberg
=========

A jQuery plugin for searching Project Gutenberg

<pre>
$.qb('goethe', function(data) {
	$.each(data.items, function(index, item){
		// here comes each items matching with 'goethe'...
	});
});
</pre>