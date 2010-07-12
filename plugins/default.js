var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "Default",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a[href]").filter(function(index) {
			return this.href.match(/\.(jpg|jpeg|gif|png)$/i);
		});
		links.each(function() {
			$(this).data('hoverzoomsrc', this.href);
		});
		return links;	
	}
});