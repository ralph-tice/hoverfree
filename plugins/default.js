var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "Default",
	"version": "1.0",
	"prepareImgLinks": function() {
		var links = $("a[href]").filter(function(index) {
			return this.href.match(/\.(jpg|jpeg|gif|png)$/i);
		});
		links.each(function(index, el) {
			$(el).data('hoverzoomsrc', el.href);
		});
		return links;	
	}
});