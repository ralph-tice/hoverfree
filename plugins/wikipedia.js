// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
	"name": "Wikipedia",
	"version": "0.1",
	"prepareImgLinks": function() {
		var links = $("a.image, div.l_image a");
		links.each(function() {		
			var src = $(this).find('img')[0].src;
			var ext = src.substr(src.lastIndexOf('.'));
			src = src.substring(0, src.indexOf(ext) + 4).replace(/thumb\//, '');
			$(this).data('hoverZoomSrc', src);
		});
		return links;		
	}
});