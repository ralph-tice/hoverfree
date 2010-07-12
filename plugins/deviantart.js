var hoverZoomPlugins = hoverZoomPlugins ? hoverZoomPlugins : [];
hoverZoomPlugins.push( {
	"name": "deviantART",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a[super_img]");
		links.each(function() {		
			$(this).data('hoverzoomsrc', $(this).attr('super_fullimg') || $(this).attr('super_img'));
		});
		return links;		
	}
});