var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "Picasa Web Albums",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a.goog-icon-list-icon-link,div.gphoto-grid-cell a");
		links.each(function() {
			var src = $(this).find('img')[0].src;
			src = src.replace(/\/(s128|s144-c)\//, '/s800/');
			$(this).data('hoverzoomsrc', src);
		});
		return links;		
	}
});