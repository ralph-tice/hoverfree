// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Flickr",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("span.photo_container a,div.context-photos a");
		var res = $();
		links.each(function() {
			
			// Image URL
			var src = $(this).find('img')[0].src;
			src = src.replace(/_[mst]\./, '.');
			
			// If an invisible link (spaceball.gif) has been put on the thumbnail...
			var spaceBall = $(this).parent().parent().find('a.image_link');
			if (spaceBall.length > 0) {
				spaceBall.data('hoverZoomSrc', src);
				res = res.add(spaceBall);
			} 

			$(this).data('hoverZoomSrc', src);
			res = res.add($(this));
		});
		return $(res);		
	}
});