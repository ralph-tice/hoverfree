var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "Flickr",
	"version": "1.0",
	"prepareImgLinks": function() {
		var links = $("span.photo_container a");
		links.each(function(index, el) {
			var src = $(el).find('img')[0].src;
			src = src.replace(/_[mst]\./, '.');
			$(el).data('hoverzoomsrc', src);
		});
		return links;		
	}
});